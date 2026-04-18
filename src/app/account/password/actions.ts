"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { getMailAdminProvider } from "@/lib/mailadmin";
import { selfServicePasswordSchema } from "@/lib/mailadmin/schemas";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function redirectWithStatus(key: "success" | "error", value: string) {
  redirect(`/account/password?${key}=${encodeURIComponent(value)}`);
}

export async function changeOwnPasswordAction(formData: FormData) {
  try {
    const provider = await getMailAdminProvider();
    const data = selfServicePasswordSchema.parse({
      email: getString(formData, "email"),
      currentPassword: String(formData.get("currentPassword") ?? ""),
      newPassword: String(formData.get("newPassword") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });

    await provider.changeMailboxPasswordSelf({
      email: data.email,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    redirectWithStatus("success", "password-updated");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unexpected error";
    redirectWithStatus("error", message);
  }
}
