/** Shared helper functions used by the markdown sync content pipeline. */
export const syncContentPipelineConfig = {
  templateVariableRegex: /\[\[\[([\s\S]*?)\]\]\]/g,
  xmlTagRegex: /<([A-Za-z][\w:-]*)(\s[^>]*)?>([\s\S]*?)<\/\1>/g,
  xmlAttributeRegex: /([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>/]+))/g,

  /** Extracts key/value attributes from an XML-like tag attribute string. */
  parseXmlAttributes(attributesSource: string): Record<string, string> {
    const attributes: Record<string, string> = {};
    this.xmlAttributeRegex.lastIndex = 0;
    let match = this.xmlAttributeRegex.exec(attributesSource);
    while (match != null) {
      const key = match[1] ?? '';
      const value = match[3] ?? match[4] ?? match[5] ?? '';
      if (key.length > 0) attributes[key] = value;
      match = this.xmlAttributeRegex.exec(attributesSource);
    }
    return attributes;
  },

  /** Serializes an XML-like attribute object into `key="value"` pairs. */
  stringifyXmlAttributes(attributes: Record<string, string>): string {
    const entries = Object.entries(attributes);
    if (entries.length === 0) return '';
    return ` ${entries.map(([key, value]) => `${key}="${value}"`).join(' ')}`;
  },

  /** Returns true when a URL should be left untouched by default link rewriting. */
  isNonRewritableLinkUrl(url: string): boolean {
    return (
      url.startsWith('#') ||
      url.startsWith('mailto:') ||
      url.startsWith('http://') ||
      url.startsWith('https://')
    );
  },

  /** Splits markdown into alternating non-fence / fence segments (fence first/last may be empty). */
  splitByCodeFences(contents: string): { isCodeFence: boolean; value: string }[] {
    const segments: { isCodeFence: boolean; value: string }[] = [];
    const fenceRegex = /```[\s\S]*?```/g;
    let lastIndex = 0;
    let match = fenceRegex.exec(contents);
    while (match != null) {
      const start = match.index;
      const end = start + match[0].length;
      if (start > lastIndex) {
        segments.push({ isCodeFence: false, value: contents.slice(lastIndex, start) });
      }
      segments.push({ isCodeFence: true, value: match[0] });
      lastIndex = end;
      match = fenceRegex.exec(contents);
    }
    if (lastIndex < contents.length) {
      segments.push({ isCodeFence: false, value: contents.slice(lastIndex) });
    }
    if (segments.length === 0) return [{ isCodeFence: false, value: contents }];
    return segments;
  },
};
