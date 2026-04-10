import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { normalizeRemoteUrl, isPrivateHostname } = require("../dist/connection/validate.js");

test("normalizeRemoteUrl strips path and preserves https origin", () => {
  const normalized = normalizeRemoteUrl("https://paperclip.example.com/app/dashboard?x=1#top");
  assert.equal(normalized.normalizedUrl, "https://paperclip.example.com/");
  assert.equal(normalized.origin, "https://paperclip.example.com");
  assert.equal(normalized.warning, undefined);
});

test("normalizeRemoteUrl rejects non-https remotes", () => {
  assert.throws(
    () => normalizeRemoteUrl("http://paperclip.example.com"),
    /must use HTTPS/i,
  );
});

test("normalizeRemoteUrl rejects embedded credentials", () => {
  assert.throws(
    () => normalizeRemoteUrl("https://user:pass@paperclip.example.com"),
    /cannot include username or password/i,
  );
});

test("isPrivateHostname recognises tailnet and RFC1918 hosts", () => {
  assert.equal(isPrivateHostname("paperclip-host.tailnet.ts.net"), true);
  assert.equal(isPrivateHostname("192.168.1.50"), true);
  assert.equal(isPrivateHostname("paperclip.example.com"), false);
});
