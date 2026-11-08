import { test } from "node:test";
import assert from "node:assert/strict";
import { passwordMatches, sessionToken, validSession, createAttemptLimiter } from "../apps/web/lib/auth.ts";

test("only the exact fixed password is accepted", () => {
  assert.equal(passwordMatches("7002"), true);
  for (const value of [undefined, null, 7002, {}, "", "700", "7003", "7002 ", "07002"]) assert.equal(passwordMatches(value), false);
});

test("sessions require the server-generated token; forged cookie values fail", () => {
  const token = sessionToken();
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.equal(sessionToken(), token);
  assert.equal(validSession(token), true);
  assert.equal(validSession(undefined), false);
  assert.equal(validSession("true"), false);
  assert.equal(validSession("7002"), false);
  const tampered = (token[0] === "a" ? "b" : "a") + token.slice(1);
  assert.equal(validSession(tampered), false);
});

test("five failed attempts block login until the one-minute window expires", () => {
  const limiter = createAttemptLimiter();
  for (let i = 0; i < 5; i++) { assert.equal(limiter.allowed(1000), true); limiter.fail(1000); }
  assert.equal(limiter.allowed(60_999), false);
  assert.equal(limiter.allowed(61_000), true);
});
