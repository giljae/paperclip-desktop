import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  buildRemoteLoopPayload,
  getRemoteLoopState,
} = require("../dist/connection/remote-loop.js");

function okResult(overrides = {}) {
  return {
    ok: true,
    normalizedUrl: "http://127.0.0.1:3200",
    origin: "http://127.0.0.1:3200",
    paperclipDetected: true,
    deploymentMode: "authenticated",
    deploymentExposure: "private",
    authReady: true,
    bootstrapStatus: "ready",
    bootstrapInviteActive: false,
    sessionState: "signed_in",
    version: "2026.403.0",
    ...overrides,
  };
}

test("remote loop prefers bootstrap-pending over signed-out", () => {
  const result = okResult({
    bootstrapStatus: "bootstrap_pending",
    sessionState: "signed_out",
  });

  assert.equal(getRemoteLoopState(result), "bootstrap_pending");

  const payload = buildRemoteLoopPayload(result);
  assert.equal(payload?.state, "bootstrap_pending");
  assert.equal(payload?.primaryActionLabel, "Open Remote Setup");
});

test("remote loop shows sign-in-required for verified signed-out remotes", () => {
  const result = okResult({
    sessionState: "signed_out",
  });

  assert.equal(getRemoteLoopState(result), "signin_required");

  const payload = buildRemoteLoopPayload(result);
  assert.equal(payload?.state, "signin_required");
  assert.equal(payload?.primaryActionLabel, "Open Remote Sign-In");
});

test("remote loop is disabled for ready signed-in remotes", () => {
  const result = okResult();

  assert.equal(getRemoteLoopState(result), null);
  assert.equal(buildRemoteLoopPayload(result), null);
});

test("remote loop ignores failed preflight results", () => {
  const result = {
    ...okResult(),
    ok: false,
    reason: "not_paperclip",
  };

  assert.equal(getRemoteLoopState(result), null);
  assert.equal(buildRemoteLoopPayload(result), null);
});
