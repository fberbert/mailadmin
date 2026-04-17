import { promisify } from "node:util";
import { execFile } from "node:child_process";

import { appEnv } from "@/lib/env";
import type {
  AliasRecord,
  DashboardMetrics,
  DomainRecord,
  MailAdminProvider,
  MailboxRecord,
  SenderAclRecord,
} from "@/lib/mailadmin/types";

const execFileAsync = promisify(execFile);

function buildCommand(args: string[]) {
  const prefix = appEnv.cliPrefix.trim();

  if (!prefix) {
    return {
      command: appEnv.cliPath,
      args,
    };
  }

  const prefixParts = prefix.split(/\s+/);
  return {
    command: prefixParts[0],
    args: [...prefixParts.slice(1), appEnv.cliPath, ...args],
  };
}

async function runMailadmin(args: string[]) {
  const command = buildCommand(args);
  const { stdout, stderr } = await execFileAsync(command.command, command.args, {
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  });

  if (stderr.trim()) {
    console.warn(stderr.trim());
  }

  return stdout.trim();
}

function parseBoolean(value: string) {
  return value === "1" || value.toLowerCase() === "true";
}

function parseDate(value: string) {
  return value ? new Date(value) : new Date();
}

export const cliProvider: MailAdminProvider = {
  async listDomains(): Promise<DomainRecord[]> {
    const [raw, mailboxesRaw, aliasesRaw] = await Promise.all([
      runMailadmin(["domain", "list"]),
      runMailadmin(["mailbox", "list"]),
      runMailadmin(["alias", "list"]),
    ]);

    const mailboxCounts = new Map<string, number>();
    const aliasCounts = new Map<string, number>();

    for (const line of mailboxesRaw.split("\n").filter(Boolean)) {
      const [, , , , domainName] = line.split("\t");
      mailboxCounts.set(domainName, (mailboxCounts.get(domainName) ?? 0) + 1);
    }

    for (const line of aliasesRaw.split("\n").filter(Boolean)) {
      const [, , , , domainName] = line.split("\t");
      aliasCounts.set(domainName, (aliasCounts.get(domainName) ?? 0) + 1);
    }

    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [id, name, active, createdAt, updatedAt] = line.split("\t");
        return {
          id: Number(id),
          name,
          active: parseBoolean(active),
          mailboxCount: mailboxCounts.get(name) ?? 0,
          aliasCount: aliasCounts.get(name) ?? 0,
          createdAt: parseDate(createdAt),
          updatedAt: parseDate(updatedAt),
        };
      });
  },

  async createDomain({ name }) {
    await runMailadmin(["domain", "add", name]);
  },

  async deleteDomain({ name }) {
    await runMailadmin(["domain", "del", name]);
  },

  async listMailboxes(): Promise<MailboxRecord[]> {
    const raw = await runMailadmin(["mailbox", "list"]);

    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [id, email, active, quotaBytes, domainName] = line.split("\t");
        const [localPart] = email.split("@");
        return {
          id: Number(id),
          email,
          localPart,
          domainName,
          active: parseBoolean(active),
          quotaBytes: quotaBytes ? BigInt(quotaBytes) : null,
          senderCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
  },

  async createMailbox({ email, password, quotaBytes }) {
    const args = ["mailbox", "add", email, "--password", password];
    if (quotaBytes !== undefined && quotaBytes !== null) {
      args.push("--quota-bytes", quotaBytes.toString());
    }
    await runMailadmin(args);
  },

  async updateMailbox({ email, active, quotaBytes }) {
    const args = ["mailbox", "update", email, active ? "--active" : "--inactive"];
    if (quotaBytes !== null) {
      args.push("--quota-bytes", quotaBytes.toString());
    } else {
      args.push("--unlimited-quota");
    }
    await runMailadmin(args);
  },

  async updateMailboxPassword({ email, password }) {
    await runMailadmin(["mailbox", "passwd", email, "--password", password]);
  },

  async deleteMailbox({ email }) {
    await runMailadmin(["mailbox", "del", email]);
  },

  async listAliases(): Promise<AliasRecord[]> {
    const raw = await runMailadmin(["alias", "list"]);

    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [id, sourceEmail, destination, active, domainName] = line.split("\t");
        return {
          id: Number(id),
          sourceEmail,
          sourceLocalPart: sourceEmail.split("@")[0] ?? sourceEmail,
          destination,
          domainName,
          active: parseBoolean(active),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
  },

  async createAlias({ sourceEmail, destination, allowSendMailbox }) {
    const args = ["alias", "add", sourceEmail, destination];
    if (allowSendMailbox) {
      args.push("--allow-send", allowSendMailbox);
    }
    await runMailadmin(args);
  },

  async deleteAlias({ sourceEmail }) {
    await runMailadmin(["alias", "del", sourceEmail]);
  },

  async listSenderAcl(): Promise<SenderAclRecord[]> {
    const mailboxes = await this.listMailboxes();
    const results: SenderAclRecord[] = [];

    for (const mailbox of mailboxes) {
      const raw = await runMailadmin(["sender-allow", "list", mailbox.email]);
      for (const line of raw.split("\n").filter(Boolean)) {
        const [id, allowedEmail, active] = line.split("\t");
        results.push({
          id: Number(id),
          mailboxId: mailbox.id,
          mailboxEmail: mailbox.email,
          allowedEmail,
          active: parseBoolean(active),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return results.sort((a, b) =>
      a.mailboxEmail.localeCompare(b.mailboxEmail) ||
      a.allowedEmail.localeCompare(b.allowedEmail),
    );
  },

  async createSenderAcl({ mailboxEmail, allowedEmail }) {
    await runMailadmin(["sender-allow", "add", mailboxEmail, allowedEmail]);
  },

  async deleteSenderAcl({ mailboxEmail, allowedEmail }) {
    await runMailadmin(["sender-allow", "del", mailboxEmail, allowedEmail]);
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [domains, mailboxes, aliases, senderAcl] = await Promise.all([
      this.listDomains(),
      this.listMailboxes(),
      this.listAliases(),
      this.listSenderAcl(),
    ]);

    return {
      domainCount: domains.length,
      mailboxCount: mailboxes.length,
      aliasCount: aliases.length,
      senderRuleCount: senderAcl.length,
    };
  },
};
