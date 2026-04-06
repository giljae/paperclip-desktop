import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  isNavigationAllowed,
  shouldOpenExternally,
  remotePartitionForProfile,
} = require("../dist/connection/window-policy.js");

test("window policy only allows same-origin navigation", () => {
  const allowedOrigin = "https://paperclip-host.tailnet.ts.net";
  assert.equal(isNavigationAllowed("https://paperclip-host.tailnet.ts.net/dashboard", allowedOrigin), true);
  assert.equal(isNavigationAllowed("https://example.com", allowedOrigin), false);
});

test("window policy opens external http links outside the allowed origin", () => {
  const allowedOrigin = "http://localhost:3100";
  assert.equal(shouldOpenExternally("https://docs.paperclip.ing", allowedOrigin), true);
  assert.equal(shouldOpenExternally("http://localhost:3100/settings", allowedOrigin), false);
  assert.equal(shouldOpenExternally("mailto:test@example.com", allowedOrigin), false);
});

test("remote partitions are isolated per profile", () => {
  assert.equal(remotePartitionForProfile("abc123"), "persist:paperclip-remote-abc123");
});
