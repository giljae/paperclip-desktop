import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { preflightRemoteConnection } = require("../dist/connection/preflight.js");

test("preflight accepts authenticated Paperclip with active session", async () => {
  const responses = [
    jsonResponse(
      {
        status: "ok",
        version: "2026.403.0",
        deploymentMode: "authenticated",
        deploymentExposure: "private",
        authReady: true,
        bootstrapStatus: "ready",
        bootstrapInviteActive: false,
      },
      200,
    ),
    jsonResponse(
      {
        session: { id: "paperclip:session:1", userId: "user-1" },
        user: { id: "user-1" },
      },
      200,
    ),
  ];

  const result = await preflightRemoteConnection({
    remoteUrl: "https://paperclip-host.tailnet.ts.net",
    localServerVersion: "2026.403.0",
    fetchImpl: async () => responses.shift(),
  });

  assert.equal(result.ok, true);
  assert.equal(result.insecureTransport, false);
  assert.equal(result.sessionState, "signed_in");
  assert.equal(result.deploymentMode, "authenticated");
  assert.equal(result.bootstrapStatus, "ready");
});

test("preflight treats 401 session probe as sign-in required", async () => {
  const responses = [
    jsonResponse(
      {
        status: "ok",
        version: "2026.403.0",
        deploymentMode: "authenticated",
        deploymentExposure: "private",
        authReady: true,
        bootstrapStatus: "bootstrap_pending",
        bootstrapInviteActive: false,
      },
      200,
    ),
    new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    }),
  ];

  const result = await preflightRemoteConnection({
    remoteUrl: "https://paperclip-host.tailnet.ts.net",
    fetchImpl: async () => responses.shift(),
  });

  assert.equal(result.ok, true);
  assert.equal(result.insecureTransport, false);
  assert.equal(result.sessionState, "signed_out");
  assert.equal(result.bootstrapStatus, "bootstrap_pending");
});

test("preflight blocks local_trusted remotes", async () => {
  const result = await preflightRemoteConnection({
    remoteUrl: "https://192.168.1.50:3100",
    fetchImpl: async () =>
      jsonResponse(
        {
          status: "ok",
          version: "2026.403.0",
          deploymentMode: "local_trusted",
          deploymentExposure: "private",
          authReady: true,
          bootstrapStatus: "ready",
          bootstrapInviteActive: false,
        },
        200,
      ),
  });

  assert.equal(result.ok, false);
  assert.equal(result.insecureTransport, false);
  assert.equal(result.reason, "unsupported_local_trusted");
});

test("preflight rejects unsupported URL schemes before any network call", async () => {
  let called = false;
  const result = await preflightRemoteConnection({
    remoteUrl: "ftp://paperclip.example.com",
    fetchImpl: async () => {
      called = true;
      return jsonResponse({ status: "ok" }, 200);
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, "invalid_url");
  assert.match(result.detail, /http or https/i);
  assert.equal(called, false);
});

test("preflight allows http remotes and carries the insecurity warning", async () => {
  const responses = [
    jsonResponse(
      {
        status: "ok",
        version: "2026.403.0",
        deploymentMode: "authenticated",
        deploymentExposure: "private",
        authReady: true,
        bootstrapStatus: "ready",
        bootstrapInviteActive: false,
      },
      200,
    ),
    new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    }),
  ];

  const result = await preflightRemoteConnection({
    remoteUrl: "http://paperclip.example.com:3200",
    fetchImpl: async () => responses.shift(),
  });

  assert.equal(result.ok, true);
  assert.equal(result.insecureTransport, true);
  assert.equal(result.origin, "http://paperclip.example.com:3200");
  assert.equal(result.sessionState, "signed_out");
  assert.match(result.warning, /without TLS/i);
});

test("preflight rejects non-Paperclip endpoints", async () => {
  const result = await preflightRemoteConnection({
    remoteUrl: "https://example.com",
    fetchImpl: async () => jsonResponse({ hello: "world" }, 200),
  });

  assert.equal(result.ok, false);
  assert.equal(result.insecureTransport, false);
  assert.equal(result.reason, "not_paperclip");
});

test("preflight classifies TLS failures", async () => {
  const result = await preflightRemoteConnection({
    remoteUrl: "https://badcert.example.com",
    fetchImpl: async () => {
      throw new Error("self-signed certificate");
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.insecureTransport, false);
  assert.equal(result.reason, "tls_error");
});

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
