import { createHash } from "node:crypto";

import { prisma } from "@/lib/prisma";
import type {
  AliasRecord,
  DashboardMetrics,
  DomainRecord,
  MailAdminProvider,
  MailboxRecord,
  SenderAclRecord,
} from "@/lib/mailadmin/types";

function splitEmail(email: string) {
  const [localPart, domainName] = email.trim().toLowerCase().split("@");

  if (!localPart || !domainName) {
    throw new Error(`Invalid email: ${email}`);
  }

  return { localPart, domainName };
}

function toDevPasswordHash(password: string) {
  return `{DEV-SHA256}${createHash("sha256").update(password).digest("hex")}`;
}

export const databaseProvider: MailAdminProvider = {
  async listDomains(): Promise<DomainRecord[]> {
    const domains = await prisma.domain.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            aliases: true,
            mailboxes: true,
          },
        },
      },
    });

    return domains.map((domain) => ({
      id: domain.id,
      name: domain.name,
      active: domain.active,
      mailboxCount: domain._count.mailboxes,
      aliasCount: domain._count.aliases,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }));
  },

  async createDomain({ name }) {
    await prisma.domain.upsert({
      where: { name: name.trim().toLowerCase() },
      update: { active: true },
      create: { name: name.trim().toLowerCase(), active: true },
    });
  },

  async deleteDomain({ name }) {
    await prisma.domain.delete({
      where: { name: name.trim().toLowerCase() },
    });
  },

  async listMailboxes(): Promise<MailboxRecord[]> {
    const mailboxes = await prisma.mailbox.findMany({
      orderBy: [{ domain: { name: "asc" } }, { email: "asc" }],
      include: {
        domain: true,
        _count: {
          select: { senderAcl: true },
        },
      },
    });

    return mailboxes.map((mailbox) => ({
      id: mailbox.id,
      email: mailbox.email,
      localPart: mailbox.localPart,
      domainName: mailbox.domain.name,
      active: mailbox.active,
      quotaBytes: mailbox.quotaBytes,
      senderCount: mailbox._count.senderAcl,
      createdAt: mailbox.createdAt,
      updatedAt: mailbox.updatedAt,
    }));
  },

  async createMailbox({ email, password, quotaBytes }) {
    const normalized = email.trim().toLowerCase();
    const { localPart, domainName } = splitEmail(normalized);
    const domain = await prisma.domain.findUnique({
      where: { name: domainName },
      select: { id: true },
    });

    if (!domain) {
      throw new Error(`Domain not found: ${domainName}`);
    }

    const mailbox = await prisma.mailbox.upsert({
      where: { email: normalized },
      update: {
        localPart,
        domainId: domain.id,
        password: toDevPasswordHash(password),
        active: true,
        quotaBytes: quotaBytes ?? null,
      },
      create: {
        email: normalized,
        localPart,
        domainId: domain.id,
        password: toDevPasswordHash(password),
        active: true,
        quotaBytes: quotaBytes ?? null,
      },
    });

    await prisma.senderAcl.upsert({
      where: {
        mailboxId_allowedEmail: {
          mailboxId: mailbox.id,
          allowedEmail: mailbox.email,
        },
      },
      update: { active: true },
      create: {
        mailboxId: mailbox.id,
        allowedEmail: mailbox.email,
        active: true,
      },
    });
  },

  async updateMailboxPassword({ email, password }) {
    await prisma.mailbox.update({
      where: { email: email.trim().toLowerCase() },
      data: { password: toDevPasswordHash(password) },
    });
  },

  async deleteMailbox({ email }) {
    await prisma.mailbox.delete({
      where: { email: email.trim().toLowerCase() },
    });
  },

  async listAliases(): Promise<AliasRecord[]> {
    const aliases = await prisma.alias.findMany({
      orderBy: [{ domain: { name: "asc" } }, { sourceEmail: "asc" }],
      include: { domain: true },
    });

    return aliases.map((alias) => ({
      id: alias.id,
      sourceEmail: alias.sourceEmail,
      sourceLocalPart: alias.sourceLocalPart,
      destination: alias.destination,
      domainName: alias.domain.name,
      active: alias.active,
      createdAt: alias.createdAt,
      updatedAt: alias.updatedAt,
    }));
  },

  async createAlias({ sourceEmail, destination, allowSendMailbox }) {
    const normalizedSource = sourceEmail.trim().toLowerCase();
    const normalizedDestination = destination.trim().toLowerCase();
    const { localPart, domainName } = splitEmail(normalizedSource);

    const domain = await prisma.domain.findUnique({
      where: { name: domainName },
      select: { id: true },
    });

    if (!domain) {
      throw new Error(`Domain not found: ${domainName}`);
    }

    await prisma.alias.upsert({
      where: { sourceEmail: normalizedSource },
      update: {
        sourceLocalPart: localPart,
        destination: normalizedDestination,
        active: true,
        domainId: domain.id,
      },
      create: {
        sourceEmail: normalizedSource,
        sourceLocalPart: localPart,
        destination: normalizedDestination,
        active: true,
        domainId: domain.id,
      },
    });

    if (allowSendMailbox) {
      const mailbox = await prisma.mailbox.findUnique({
        where: { email: allowSendMailbox.trim().toLowerCase() },
      });

      if (!mailbox) {
        throw new Error(`Mailbox not found: ${allowSendMailbox}`);
      }

      await prisma.senderAcl.upsert({
        where: {
          mailboxId_allowedEmail: {
            mailboxId: mailbox.id,
            allowedEmail: normalizedSource,
          },
        },
        update: { active: true },
        create: {
          mailboxId: mailbox.id,
          allowedEmail: normalizedSource,
          active: true,
        },
      });
    }
  },

  async deleteAlias({ sourceEmail }) {
    await prisma.alias.delete({
      where: { sourceEmail: sourceEmail.trim().toLowerCase() },
    });
  },

  async listSenderAcl(): Promise<SenderAclRecord[]> {
    const rules = await prisma.senderAcl.findMany({
      orderBy: [{ mailbox: { email: "asc" } }, { allowedEmail: "asc" }],
      include: { mailbox: true },
    });

    return rules.map((rule) => ({
      id: rule.id,
      mailboxId: rule.mailboxId,
      mailboxEmail: rule.mailbox.email,
      allowedEmail: rule.allowedEmail,
      active: rule.active,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    }));
  },

  async createSenderAcl({ mailboxEmail, allowedEmail }) {
    const mailbox = await prisma.mailbox.findUnique({
      where: { email: mailboxEmail.trim().toLowerCase() },
    });

    if (!mailbox) {
      throw new Error(`Mailbox not found: ${mailboxEmail}`);
    }

    await prisma.senderAcl.upsert({
      where: {
        mailboxId_allowedEmail: {
          mailboxId: mailbox.id,
          allowedEmail: allowedEmail.trim().toLowerCase(),
        },
      },
      update: { active: true },
      create: {
        mailboxId: mailbox.id,
        allowedEmail: allowedEmail.trim().toLowerCase(),
        active: true,
      },
    });
  },

  async deleteSenderAcl({ mailboxEmail, allowedEmail }) {
    const mailbox = await prisma.mailbox.findUnique({
      where: { email: mailboxEmail.trim().toLowerCase() },
    });

    if (!mailbox) {
      throw new Error(`Mailbox not found: ${mailboxEmail}`);
    }

    await prisma.senderAcl.delete({
      where: {
        mailboxId_allowedEmail: {
          mailboxId: mailbox.id,
          allowedEmail: allowedEmail.trim().toLowerCase(),
        },
      },
    });
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [domainCount, mailboxCount, aliasCount, senderRuleCount] = await Promise.all([
      prisma.domain.count(),
      prisma.mailbox.count(),
      prisma.alias.count(),
      prisma.senderAcl.count(),
    ]);

    return { domainCount, mailboxCount, aliasCount, senderRuleCount };
  },
};
