"use server";

import { redirect } from "next/navigation";

import { createSession, destroySession } from "@/lib/auth";
import { appEnv } from "@/lib/env";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (username !== appEnv.adminUsername || password !== appEnv.adminPassword) {
    redirect("/login?error=invalid-credentials");
  }

  await createSession();
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
