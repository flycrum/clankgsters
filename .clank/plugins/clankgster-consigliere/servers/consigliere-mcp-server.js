#!/usr/bin/env node

/**
 * consigliere MCP server (no-build JS implementation)
 *
 * Implements a stdio JSON-RPC MCP server with explicit tool -> skill routing.
 *
 * Architectural intent:
 * - expose MCP tools that resolve to canonical route metadata
 * - return structured handoff payloads for downstream skill execution
 * - avoid implicit "tool auto-runs skill" assumptions
 *
 * Deliberate non-goals for this module:
 * - does not execute SKILL.md files directly
 * - does not mutate repository files
 * - does not own business workflow state outside routing metadata
 *
 * This server is intentionally a routing layer so skill orchestration remains
 * explicit and auditable in skill docs and route tables.
 */

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_INFO = { name: 'consigliere', version: '0.2.0' };
const CONTRACT_VERSION = '1.0.0';

/**
 * Canonical routing registry.
 * Single source of truth for route IDs, tools, and target skills.
 *
 * Each route row defines:
 * - routeId: internal stable identifier
 * - toolName: externally exposed MCP tool name
 * - targetSkillId: target workflow identifier for human/model handoff
 * - pathway/action: semantic grouping used in docs and orchestration
 * - inputSchema: contract for accepted `tools/call` arguments
 *
 * Important: this registry documents and enforces explicit mapping. There is
 * no platform-level automatic binding from MCP tool names to skill files.
 */
const ROUTES = [
  {
    routeId: 'common.triage',
    toolName: 'Triage',
    targetSkillId: 'common-triage-context-type',
    pathway: 'common',
    action: 'triage',
    description: 'Select source pathway and return route handoff data',
    inputSchema: {
      type: 'object',
      properties: {
        mode: { type: 'string', enum: ['analyze', 'explicit'] },
        selectedPathway: { type: 'string', enum: ['plugins', 'skills', 'clankmd'] },
        userIntent: { type: 'string' },
        context: { type: 'object', additionalProperties: true },
      },
      additionalProperties: false,
    },
  },
  {
    routeId: 'plugins.write',
    toolName: 'PluginsWrite',
    targetSkillId: 'plugins-write-context',
    pathway: 'plugins',
    action: 'write',
    description: 'Route plugin write workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'plugins.update',
    toolName: 'PluginsUpdate',
    targetSkillId: 'plugins-update-context',
    pathway: 'plugins',
    action: 'update',
    description: 'Route plugin update workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'plugins.remove',
    toolName: 'PluginsRemove',
    targetSkillId: 'plugins-remove-context',
    pathway: 'plugins',
    action: 'remove',
    description: 'Route plugin removal workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'plugins.audit',
    toolName: 'PluginsAudit',
    targetSkillId: 'common-audit-all-orchestrator',
    pathway: 'plugins',
    action: 'audit',
    description: 'Route plugin audit workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'skills.write',
    toolName: 'SkillsWrite',
    targetSkillId: 'skills-write-context',
    pathway: 'skills',
    action: 'write',
    description: 'Route standalone skill write workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'skills.update',
    toolName: 'SkillsUpdate',
    targetSkillId: 'skills-update-context',
    pathway: 'skills',
    action: 'update',
    description: 'Route standalone skill update workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'skills.remove',
    toolName: 'SkillsRemove',
    targetSkillId: 'skills-remove-context',
    pathway: 'skills',
    action: 'remove',
    description: 'Route standalone skill removal workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'skills.audit',
    toolName: 'SkillsAudit',
    targetSkillId: 'common-audit-all-orchestrator',
    pathway: 'skills',
    action: 'audit',
    description: 'Route standalone skill audit workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'clankmd.write',
    toolName: 'ClankMdWrite',
    targetSkillId: 'clankmd-write-context',
    pathway: 'clankmd',
    action: 'write',
    description: 'Route CLANK.md write workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'clankmd.update',
    toolName: 'ClankMdUpdate',
    targetSkillId: 'clankmd-update-context',
    pathway: 'clankmd',
    action: 'update',
    description: 'Route CLANK.md update workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'clankmd.remove',
    toolName: 'ClankMdRemove',
    targetSkillId: 'clankmd-remove-context',
    pathway: 'clankmd',
    action: 'remove',
    description: 'Route CLANK.md removal workflows',
    inputSchema: genericRouteInputSchema(),
  },
  {
    routeId: 'clankmd.audit',
    toolName: 'ClankMdAudit',
    targetSkillId: 'common-audit-all-orchestrator',
    pathway: 'clankmd',
    action: 'audit',
    description: 'Route CLANK.md audit workflows',
    inputSchema: genericRouteInputSchema(),
  },
];

/** Shared input schema for non-triage route tools. */
function genericRouteInputSchema() {
  return {
    type: 'object',
    properties: {
      targetPath: { type: 'string' },
      userIntent: { type: 'string' },
      dryRun: { type: 'boolean' },
      context: { type: 'object', additionalProperties: true },
    },
    additionalProperties: false,
  };
}

/** Fast lookup map from public MCP tool name -> canonical route definition. */
const ROUTES_BY_TOOL = new Map(ROUTES.map((route) => [route.toolName, route]));

/** Accumulates raw stdio bytes until one or more complete MCP frames exist. */
let stdinBuffer = Buffer.alloc(0);

/** Ingest stdio chunks and continuously drain complete frames. */
process.stdin.on('data', (chunk) => {
  stdinBuffer = Buffer.concat([stdinBuffer, chunk]);
  readFrames();
});

/**
 * Parse MCP stdio frames from `stdinBuffer`.
 *
 * Frame format:
 * - headers ending with CRLF CRLF
 * - `Content-Length` bytes of UTF-8 JSON body
 *
 * Behavior notes:
 * - leaves partial frames in the buffer until complete
 * - drops entire buffer on invalid content-length (defensive recovery)
 * - ignores malformed JSON bodies (server remains alive)
 */
function readFrames() {
  while (true) {
    const headerEnd = stdinBuffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) return;

    const headerText = stdinBuffer.slice(0, headerEnd).toString('utf8');
    const headers = parseHeaders(headerText);
    const contentLength = Number.parseInt(headers['content-length'] ?? '', 10);
    if (!Number.isFinite(contentLength) || contentLength < 0) {
      stdinBuffer = Buffer.alloc(0);
      return;
    }

    const frameEnd = headerEnd + 4 + contentLength;
    if (stdinBuffer.length < frameEnd) return;

    const body = stdinBuffer.slice(headerEnd + 4, frameEnd).toString('utf8');
    stdinBuffer = stdinBuffer.slice(frameEnd);

    try {
      const message = JSON.parse(body);
      handleMessage(message);
    } catch {
      // Ignore malformed JSON payloads.
    }
  }
}

/**
 * Parse CRLF-separated headers into a lowercase-key dictionary.
 *
 * @param {string} headerText Raw header block before body delimiter.
 * @returns {Record<string, string>}
 */
function parseHeaders(headerText) {
  const out = {};
  for (const line of headerText.split('\r\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    out[key] = value;
  }
  return out;
}

/**
 * Write a JSON-RPC message to stdout using MCP stdio framing.
 *
 * @param {object} message JSON-RPC response payload.
 */
function send(message) {
  const payload = Buffer.from(JSON.stringify(message), 'utf8');
  process.stdout.write(`Content-Length: ${payload.length}\r\n\r\n`);
  process.stdout.write(payload);
}

/** Send a JSON-RPC success response envelope. */
function sendResult(id, result) {
  send({ jsonrpc: '2.0', id, result });
}

/**
 * Send a JSON-RPC error response envelope.
 *
 * @param {string|number|null} id Correlation id from inbound request.
 * @param {number} code JSON-RPC error code.
 * @param {string} message Human-readable error message.
 * @param {unknown} data Optional machine-readable error data.
 */
function sendError(id, code, message, data) {
  send({
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      ...(data == null ? {} : { data }),
    },
  });
}

/**
 * Dispatch inbound JSON-RPC requests.
 *
 * Supported methods:
 * - `initialize`: negotiate protocol/server capabilities
 * - `tools/list`: publish tool catalog from route registry
 * - `tools/call`: resolve one tool call into route handoff payload
 * - `ping`: health check
 *
 * Unknown methods return `-32601 Method not found`.
 */
function handleMessage(message) {
  if (!message || typeof message !== 'object') return;
  if (message.jsonrpc !== '2.0') return;

  // Notifications have no id.
  if (message.id == null) return;

  const { id, method, params } = message;

  switch (method) {
    /** MCP session initialization + capability advertisement. */
    case 'initialize':
      sendResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
      });
      return;

    /** Tool catalog materialized directly from the canonical route registry. */
    case 'tools/list':
      sendResult(id, {
        tools: ROUTES.map((route) => ({
          name: route.toolName,
          title: route.routeId,
          description: `${route.description}. Routes to skill ${route.targetSkillId}.`,
          inputSchema: route.inputSchema,
        })),
      });
      return;

    /** Route-aware tool call handling with structured handoff payloads. */
    case 'tools/call':
      handleToolsCall(id, params);
      return;

    /** Lightweight health/liveness check. */
    case 'ping':
      sendResult(id, {});
      return;

    /** Any other JSON-RPC method is unsupported in this server. */
    default:
      sendError(id, -32601, 'Method not found', { method });
  }
}

/**
 * Handle `tools/call` for route-backed MCP tools.
 *
 * This function validates requested tool names, resolves route metadata, and
 * returns a structured handoff payload for downstream workflow execution.
 * It does not execute the target skill.
 */
function handleToolsCall(id, params) {
  const toolName = params?.name;
  if (typeof toolName !== 'string' || toolName.length === 0) {
    /** JSON-RPC parameter validation failure for required tool name. */
    sendError(id, -32602, 'Invalid params', {
      code: 'INVALID_TOOL_NAME',
      message: 'tools/call requires params.name',
    });
    return;
  }

  const route = ROUTES_BY_TOOL.get(toolName);
  if (!route) {
    /**
     * Tool-level unknown error returned as successful JSON-RPC envelope with
     * `isError: true`, matching common MCP tool error semantics.
     */
    sendResult(id, {
      content: [
        {
          type: 'text',
          text: `Unknown tool: ${toolName}`,
        },
      ],
      isError: true,
      structuredContent: {
        contractVersion: CONTRACT_VERSION,
        ok: false,
        error: {
          code: 'UNKNOWN_TOOL',
          message: `Tool ${toolName} is not registered`,
          retryable: false,
        },
      },
    });
    return;
  }

  /** Canonical contract payload for explicit route -> skill handoff. */
  const routePayload = {
    contractVersion: CONTRACT_VERSION,
    ok: true,
    routeId: route.routeId,
    toolName: route.toolName,
    targetSkillId: route.targetSkillId,
    pathway: route.pathway,
    action: route.action,
    input: params?.arguments ?? {},
    handoff: {
      recommendedSkillCommand: `/${route.targetSkillId}`,
      note: 'This MCP tool resolves routing metadata; it does not execute SKILL.md directly.',
    },
  };

  /** Success response includes both text content and structuredContent. */
  sendResult(id, {
    content: [
      {
        type: 'text',
        text: JSON.stringify(routePayload, null, 2),
      },
    ],
    structuredContent: routePayload,
  });
}
