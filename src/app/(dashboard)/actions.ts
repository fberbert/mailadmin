"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { mailAdminProvider } from "@/lib/mailadmin";
import {
  aliasSchema,
  domainSchema,
  mailboxSchema,
  passwordSchema,
  senderAclSchema,
} from "@/lib/mailadmin/schemas";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function failure(pathname: string, error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  redirect(`${pathname}?error=${encodeURIComponent(message)}`);
}

export async function createDomainAction(formData: FormData) {
  try {
    const data = domainSchema.parse({ name: getString(formData, "name") });
    await mailAdminProvider.createDomain(data);
    revalidatePath("/");
    revalidatePath("/domains");
    redirect("/domains?success=domain-created");
  } catch (error) {
    failure("/domains", error);
  }
}

export async function deleteDomainAction(formData: FormData) {
  try {
    await mailAdminProvider.deleteDomain({ name: getString(formData, "name") });
    revalidatePath("/");
    revalidatePath("/domains");
    redirect("/domains?success=domain-deleted");
  } catch (error) {
    failure("/domains", error);
  }
}

export async function createMailboxAction(formData: FormData) {
  try {
    const data = mailboxSchema.parse({
      email: getString(formData, "email"),
      password: getString(formData, "password"),
      quotaBytes: getString(formData, "quotaBytes"),
    });
    await mailAdminProvider.createMailbox(data);
    revalidatePath("/");
    revalidatePath("/mailboxes");
    redirect("/mailboxes?success=mailbox-created");
  } catch (error) {
    failure("/mailboxes", error);
  }
}

export async function updateMailboxPasswordAction(formData: FormData) {
  try {
    const data = passwordSchema.parse({
      email: getString(formData, "email"),
      password: getString(formData, "password"),
    });
    await mailAdminProvider.updateMailboxPassword(data);
    revalidatePath("/mailboxes");
    redirect("/mailboxes?success=password-updated");
  } catch (error) {
    failure("/mailboxes", error);
  }
}

export async function deleteMailboxAction(formData: FormData) {
  try {
    await mailAdminProvider.deleteMailbox({ email: getString(formData, "email") });
    revalidatePath("/");
    revalidatePath("/mailboxes");
    revalidatePath("/sender-acl");
    redirect("/mailboxes?success=mailbox-deleted");
  } catch (error) {
    failure("/mailboxes", error);
  }
}

export async function createAliasAction(formData: FormData) {
  try {
    const data = aliasSchema.parse({
      sourceEmail: getString(formData, "sourceEmail"),
      destination: getString(formData, "destination"),
      allowSendMailbox: getString(formData, "allowSendMailbox") || undefined,
    });
    await mailAdminProvider.createAlias(data);
    revalidatePath("/");
    revalidatePath("/aliases");
    revalidatePath("/sender-acl");
    redirect("/aliases?success=alias-created");
  } catch (error) {
    failure("/aliases", error);
  }
}

export async function deleteAliasAction(formData: FormData) {
  try {
    await mailAdminProvider.deleteAlias({ sourceEmail: getString(formData, "sourceEmail") });
    revalidatePath("/");
    revalidatePath("/aliases");
    redirect("/aliases?success=alias-deleted");
  } catch (error) {
    failure("/aliases", error);
  }
}

export async function createSenderAclAction(formData: FormData) {
  try {
    const data = senderAclSchema.parse({
      mailboxEmail: getString(formData, "mailboxEmail"),
      allowedEmail: getString(formData, "allowedEmail"),
    });
    await mailAdminProvider.createSenderAcl(data);
    revalidatePath("/");
    revalidatePath("/sender-acl");
    redirect("/sender-acl?success=sender-rule-created");
  } catch (error) {
    failure("/sender-acl", error);
  }
}

export async function deleteSenderAclAction(formData: FormData) {
  try {
    const data = senderAclSchema.parse({
      mailboxEmail: getString(formData, "mailboxEmail"),
      allowedEmail: getString(formData, "allowedEmail"),
    });
    await mailAdminProvider.deleteSenderAcl(data);
    revalidatePath("/");
    revalidatePath("/sender-acl");
    redirect("/sender-acl?success=sender-rule-deleted");
  } catch (error) {
    failure("/sender-acl", error);
  }
}
