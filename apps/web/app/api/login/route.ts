import { NextRequest, NextResponse } from "next/server";
import { createAttemptLimiter, passwordMatches, sessionCookie, sessionToken } from "../../../lib/auth";

export const runtime = "nodejs";
const limiter = createAttemptLimiter();

export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  const origin = request.headers.get("origin");
  let sameOrigin = false;
  try { sameOrigin = Boolean(origin && new URL(origin).host === request.headers.get("host")); }
  catch { /* Reject malformed Origin headers. */ }
  if (!sameOrigin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });
  }
  if (!limiter.allowed()) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429, headers: { ...headers, "Retry-After": "60" } });
  }
  let password: unknown;
  try {
    const text = await request.text();
    if (text.length > 256) throw new Error("Request too large");
    password = (JSON.parse(text) as { password?: unknown } | null)?.password;
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400, headers }); }
  if (!passwordMatches(password)) {
    limiter.fail();
    return NextResponse.json({ error: "Invalid password" }, { status: 401, headers });
  }
  const response = NextResponse.json({ ok: true }, { headers });
  response.cookies.set(sessionCookie, sessionToken(), {
    httpOnly: true, sameSite: "strict", path: "/",
    secure: request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https",
  });
  return response;
}
