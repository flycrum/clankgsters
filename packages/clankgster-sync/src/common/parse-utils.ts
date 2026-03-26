/** Small string parsers shared by scripts (e.g. env overrides). */
export const parseUtils = {
  /** Parses common truthy/falsy string forms; returns `undefined` when unset or unrecognized. */
  parseBool(value: string | undefined): boolean | undefined {
    if (value == null) return undefined;
    const normalized = value.trim().toLowerCase();
    if (normalized === '1' || normalized === 'true') return true;
    if (normalized === '0' || normalized === 'false') return false;
    return undefined;
  },
};
