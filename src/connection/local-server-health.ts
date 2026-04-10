export interface LocalServerHealthOptions {
  origin: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export interface LocalServerHealthResult {
  ok: boolean;
  detail?: string;
}

export async function probeLocalServerHealth(
  options: LocalServerHealthOptions,
): Promise<LocalServerHealthResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 5_000;

  try {
    const response = await fetchWithTimeout(fetchImpl, new URL("/api/health", options.origin), timeoutMs);
    if (response.status !== 200) {
      return {
        ok: false,
        detail: `Health endpoint returned HTTP ${response.status}.`,
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return {
        ok: false,
        detail: "Health endpoint returned a non-JSON response.",
      };
    }

    const body = await response.json();
    if (isObject(body) && body.status === "ok") {
      return { ok: true };
    }

    const status = isObject(body) && typeof body.status === "string"
      ? body.status
      : "unknown";
    return {
      ok: false,
      detail: `Health endpoint reported status "${status}".`,
    };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "Local server health check failed.",
    };
  }
}

async function fetchWithTimeout(fetchImpl: typeof fetch, url: URL, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetchImpl(url, {
      method: "GET",
      headers: { accept: "application/json" },
      redirect: "manual",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
