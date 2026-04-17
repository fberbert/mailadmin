"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { getMailAdminProvider } from "@/lib/mailadmin";
import {
  aliasSchema,
  domainSchema,
  mailboxSchema,
  mailboxUpdateSchema,
  passwordSchema,
  senderAclSchema,
} from "@/lib/mailadmin/schemas";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function buildRedirectTarget(returnTo: string | undefined, fallbackPath: string) {
  const target = returnTo && returnTo.startsWith("/") ? returnTo : fallbackPath;
  return new URL(target, "http://mailadmin.local");
}

function redirectWithStatus(
  returnTo: string | undefined,
  fallbackPath: string,
  key: "success" | "error",
  value: string,
) {
  const url = buildRedirectTarget(returnTo, fallbackPath);
  url.searchParams.set(key, value);
  redirect(`${url.pathname}${url.search}`);
}

function failure(pathname: string, returnTo: string | undefined, error: unknown) {
  if (isRedirectError(error)) {
    throw error;
  }

  const message = error instanceof Error ? error.message : "Unexpected error";
  redirectWithStatus(returnTo, pathname, "error", message);
}

export async function createDomainAction(formData: FormData) {
  const returnTo = getString(formData, "returnTo");

  try {
    const mailAdminProvider = await getMailAdminProvider();
    const data = domainSchema.parse({ name: getString(formData, "name") });
    await mailAdminProvider.createDomain(data);
    revalidatePath("/");
    revalidatePath("/domains");
    redirectWithStatus(returnTo, "/domains", "success", "domain-created");
  } catch (error) {
    failure("/domains", returnTo, error);
  }
}

export async function deleteDomainAction(formData: FormData) {
  const returnTo = getString(formData, "returnTo");

  try {
    const mailAdminProvider = await getMailAdminProvider();
    await mailAdminProvider.deleteDomain({ name: getString(formData, "name") });
    revalidatePath("/");
    revalidatePath("/domains");
    redirectWithStatus(returnTo, "/domains", "success", "domain-deleted");
  } catch (error) {
    failure("/domains", returnTo, error);
  }
}

export async function createMailboxAction(formData: FormData) {
  const returnTo = getString(formData, "returnTo");

  try {
    const mailAdminProvider = await getMailAdminProvider();
    const data = mailboxSchema.parse({
      email: getString(formData, "email"),
      password: getString(formData, "password"),
      quotaBytes: getString(formData, "quotaBytes"),
    });
    await mailAdminProvider.createMailbox(data);
    revalidatePath("/");
    revalidatePath("/mailboxes");
    redirectWithStatus(returnTo, "/mailboxes", "success", "mailbox-created");
  } catch (error) {
    failure("/mailboxes", returnTo, error);
  }
}

export async function updateMailboxPasswordAction(formData: FormData) {
  const returnTo = getString(formData, "returnTo");

  try {
    const mailAdminProvider = await getMailAdminProvider();
    const data = passwordSchema.parse({
      email: getString(formData, "email"),
      password: getString(formData, "password"),
    });
    await mailAdminProvider.updateMailboxPassword(data);
    revalidatePath("/mailboxes");
    redirectWithStatus(returnTo, "/mailboxes", "success", "password-updated");
  } catch (error) {
    failure("/mailboxes", returnTo, error);
  }
}

export async function updateMailboxAction(formData: FormData) {
  const returnTo = getString(formData, "returnTo");

  try {
    const mailAdminProvider = await getMailAdminProvider();
    const data = mailboxUpdateSchema.parse({
      email: getString(formData, "email"),
      active: getString(formData, "active"),
      quotaBytes: getString(formData, "quotaBytes"),
    });
    await mailAdminProvider.updateMailbox(data);
    revalidatePath("/");
    revalidatePath("/mailboxes");
    redirectWithStatus(returnTo, "/mailboxes", "success", "mailbox-updated");
  } catch (error) {
    failure("/mailboxes", returnTo, error);
  }
}

export async function deleteMailboxAction(formData: FormData) {
  const returnTo = getString(formData, "returnTo");

  try {
    const mailAdminProvider = await getMailAdminProvider();
    await mailAdminProvider.deleteMailbox({ email: getString(formData, "email") });
    revalidatePath("/");
    revalidatePath("/mailboxes");
    revalidatePath("/sender-acl");
    redirectWithStatus(returnTo, "/mailboxes", "success", "mailbox-deleted");
  } catch (error) {
    failure("/mailboxes", returnTo, error);
  }
}

export async function createAliasAction(formData: FormData) {
  const returnTo = getString(formData, "returnTo");

  try {
    const mailAdminProvider = await getMailAdminProvider();
    const data = aliasSchema.parse({
      sourceEmail: getString(formData, "sourceEmail"),
      destination: getString(formData, "destination"),
      allowSendMailbox: getString(formData, "allowSendMailbox") || undefined,
    });
    await mailAdminProvider.createAlias(data);
    revalidatePath("/");
    revalidatePath("/aliases");
    revalidatePath("/sender-acl");
    redirectWithStatus(returnTo, "/aliases", "success", "alias-created");
  } catch (error) {
    failure("/aliases", returnTo, error);
  }
}

export async function deleteAliasAction(formData: FormData) {
  const returnTo = getString(formData, "returnTo");

  try {
    const mailAdminProvider = await getMailAdminProvider();
    await mailAdminProvider.deleteAlias({ sourceEmail: getString(formData, "sourceEmail") });
    revalidatePath("/");
    revalidatePath("/aliases");
    redirectWithStatus(returnTo, "/aliases", "success", "alias-deleted");
  } catch (error) {
    failure("/aliases", returnTo, error);
  }
}

export async function createSenderAclAction(formData: FormData) {
  const returnTo = getString(formData, "returnTo");

  try {
    const mailAdminProvider = await getMailAdminProvider();
    const data = senderAclSchema.parse({
      mailboxEmail: getString(formData, "mailboxEmail"),
      allowedEmail: getString(formData, "allowedEmail"),
    });
    await mailAdminProvider.createSenderAcl(data);
    revalidatePath("/");
    revalidatePath("/sender-acl");
    redirectWithStatus(returnTo, "/sender-acl", "success", "sender-rule-created");
  } catch (error) {
    failure("/sender-acl", returnTo, error);
  }
}

export async function deleteSenderAclAction(formData: FormData) {
  const returnTo = getString(formData, "returnTo");

  try {
    const mailAdminProvider = await getMailAdminProvider();
    const data = senderAclSchema.parse({
      mailboxEmail: getString(formData, "mailboxEmail"),
      allowedEmail: getString(formData, "allowedEmail"),
    });
    await mailAdminProvider.deleteSenderAcl(data);
    revalidatePath("/");
    revalidatePath("/sender-acl");
    redirectWithStatus(returnTo, "/sender-acl", "success", "sender-rule-deleted");
  } catch (error) {
    failure("/sender-acl", returnTo, error);
  }
}
