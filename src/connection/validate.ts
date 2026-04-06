export interface NormalizedRemoteUrl {
  input: string;
  normalizedUrl: string;
  origin: string;
  warning?: string;
}

const PRIVATE_HOST_SUFFIXES = [".internal", ".local", ".lan", ".home", ".ts.net"];

export function normalizeRemoteUrl(input: string): NormalizedRemoteUrl {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Enter a valid http(s) URL.");
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Enter a valid http(s) URL.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Enter a valid http(s) URL.");
  }

  if (parsed.username || parsed.password) {
    throw new Error("Remote URLs cannot include username or password.");
  }

  parsed.pathname = "/";
  parsed.search = "";
  parsed.hash = "";

  const normalizedUrl = parsed.toString();
  return {
    input: trimmed,
    normalizedUrl,
    origin: parsed.origin,
    warning: resolveTransportWarning(parsed),
  };
}

export function isPrivateHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  if (lower === "localhost" || lower === "::1" || lower.endsWith(".localhost")) {
    return true;
  }

  if (PRIVATE_HOST_SUFFIXES.some((suffix) => lower.endsWith(suffix))) {
    return true;
  }

  if (isPrivateIpv4(lower) || isPrivateIpv6(lower)) {
    return true;
  }

  return false;
}

function resolveTransportWarning(url: URL): string | undefined {
  if (url.protocol === "https:") {
    return undefined;
  }

  if (isPrivateHostname(url.hostname)) {
    return undefined;
  }

  return "This remote is using HTTP. Prefer HTTPS unless you fully trust the network path.";
}

function isPrivateIpv4(hostname: string): boolean {
  const match = hostname.match(/^(\d{1,3})(?:\.(\d{1,3})){3}$/);
  if (!match) {
    return false;
  }

  const parts = hostname.split(".").map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return false;
  }

  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    (a === 100 && b >= 64 && b <= 127)
  );
}

function isPrivateIpv6(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd");
}
