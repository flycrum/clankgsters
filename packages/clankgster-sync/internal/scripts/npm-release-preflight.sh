#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${PACKAGE_DIR}"

echo "Running @clankgster/sync release preflight..."
echo " - check"
pnpm run check
echo " - test"
pnpm run test
echo " - build"
vp pack src/index.ts

echo "Packing npm tarball..."
PACK_OUTPUT="$(pnpm pack --config.ignore-scripts=true)"
TARBALL_FILENAME="$(printf '%s\n' "${PACK_OUTPUT}" | awk '/\.tgz$/ {print $0}' | awk 'END{print}')"
if [[ -z "${TARBALL_FILENAME}" ]]; then
  echo "Failed to determine tarball filename from pnpm pack output."
  exit 1
fi
TARBALL_PATH="${PACKAGE_DIR}/${TARBALL_FILENAME}"

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

tar -xzf "${TARBALL_PATH}" -C "${TMP_DIR}"
PACKED_PACKAGE_JSON="${TMP_DIR}/package/package.json"

if [[ ! -f "${PACKED_PACKAGE_JSON}" ]]; then
  echo "Packed package.json not found at ${PACKED_PACKAGE_JSON}."
  exit 1
fi

echo "Validating packed dependency specs..."
node -e '
const fs = require("node:fs");
const path = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(path, "utf8"));
const sections = ["dependencies", "peerDependencies", "optionalDependencies"];
const bad = [];
for (const section of sections) {
  const deps = pkg[section];
  if (!deps || typeof deps !== "object") continue;
  for (const [name, spec] of Object.entries(deps)) {
    if (typeof spec !== "string") continue;
    if (spec.includes("catalog:") || spec.includes("workspace:")) {
      bad.push(`${section}.${name}=${spec}`);
    }
  }
}
if (bad.length > 0) {
  console.error("Packed manifest has unsupported dependency specs:");
  for (const line of bad) console.error(` - ${line}`);
  process.exit(1);
}
console.log("Packed dependency specs look publish-safe.");
' "${PACKED_PACKAGE_JSON}"

echo "TARBALL_PATH=${TARBALL_PATH}"
