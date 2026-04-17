import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { appEnv } from "@/lib/env";

const COOKIE_NAME = "mailadmin_session";
const ONE_DAY = 60 * 60 * 24;

function sign(value: string) {
  return createHmac("sha256", appEnv.authSecret).update(value).digest("base64url");
}

function encode(payload: { username: string; expiresAt: number }) {
  const raw = `${payload.username}.${payload.expiresAt}`;
  const signature = sign(raw);
  return Buffer.from(`${raw}.${signature}`).toString("base64url");
}

function decode(token: string) {
  const decoded = Buffer.from(token, "base64url").toString("utf8");
  const [username, expiresAtRaw, signature] = decoded.split(".");

  if (!username || !expiresAtRaw || !signature) {
    return null;
  }

  const raw = `${username}.${expiresAtRaw}`;
  const expected = sign(raw);

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== actualBuffer.length ||
    !timingSafeEqual(expectedBuffer, actualBuffer)
  ) {
    return null;
  }

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return null;
  }

  return { username, expiresAt };
}

export async function createSession() {
  const expiresAt = Date.now() + ONE_DAY * 1000;
  const token = encode({ username: appEnv.adminUsername, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decode(token);
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
