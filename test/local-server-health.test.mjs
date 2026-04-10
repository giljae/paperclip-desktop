import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { probeLocalServerHealth } = require("../dist/connection/local-server-health.js");

test("local server health probe accepts an ok health payload", async () => {
  const result = await probeLocalServerHealth({
    origin: "http://127.0.0.1:3100",
    fetchImpl: async () => jsonResponse({ status: "ok" }, 200),
  });

  assert.equal(result.ok, true);
  assert.equal(result.detail, undefined);
});

test("local server health probe rejects unhealthy payloads", async () => {
  const result = await probeLocalServerHealth({
    origin: "http://127.0.0.1:3100",
    fetchImpl: async () => jsonResponse({ status: "starting" }, 200),
  });

  assert.equal(result.ok, false);
  assert.match(result.detail, /starting/);
});

test("local server health probe reports transport failures", async () => {
  const result = await probeLocalServerHealth({
    origin: "http://127.0.0.1:3100",
    fetchImpl: async () => {
      throw new Error("socket hang up");
    },
  });

  assert.equal(result.ok, false);
  assert.match(result.detail, /socket hang up/);
});

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
