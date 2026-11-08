import { randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const sessionCookie = "kitty_session";

export function passwordMatches(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const expected = Buffer.from("7002");
  const actual = Buffer.from(value);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Shared by server bundles in this container; never included in client code.
// A fresh container creates a fresh token, invalidating earlier sessions.
export function sessionToken(): string {
  const instance = createHash("sha256").update(process.cwd()).digest("hex").slice(0, 16);
  const directory = join(tmpdir(), `kitty-session-${instance}`);
  const path = join(directory, "token");
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  try { writeFileSync(path, randomBytes(32).toString("hex"), { flag: "wx", mode: 0o600 }); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error; }
  const token = readFileSync(path, "utf8");
  if (!/^[a-f0-9]{64}$/.test(token)) throw new Error("Invalid session token");
  return token;
}

export function validSession(value: string | undefined): boolean {
  if (!value || !/^[a-f0-9]{64}$/.test(value)) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(sessionToken()));
}

export function createAttemptLimiter(limit = 5, windowMs = 60_000) {
  let failures: number[] = [];
  return {
    allowed(now = Date.now()) {
      failures = failures.filter((time) => time > now - windowMs);
      return failures.length < limit;
    },
    fail(now = Date.now()) { failures.push(now); },
  };
}
