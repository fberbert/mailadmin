export type DomainRecord = {
  id: number;
  name: string;
  active: boolean;
  mailboxCount: number;
  aliasCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type MailboxRecord = {
  id: number;
  email: string;
  localPart: string;
  domainName: string;
  active: boolean;
  quotaBytes: bigint | null;
  senderCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AliasRecord = {
  id: number;
  sourceEmail: string;
  sourceLocalPart: string;
  destination: string;
  domainName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SenderAclRecord = {
  id: number;
  mailboxId: number;
  mailboxEmail: string;
  allowedEmail: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DashboardMetrics = {
  domainCount: number;
  mailboxCount: number;
  aliasCount: number;
  senderRuleCount: number;
};

export type MailAdminProvider = {
  listDomains(): Promise<DomainRecord[]>;
  createDomain(input: { name: string }): Promise<void>;
  deleteDomain(input: { name: string }): Promise<void>;
  listMailboxes(): Promise<MailboxRecord[]>;
  createMailbox(input: { email: string; password: string; quotaBytes?: bigint | null }): Promise<void>;
  updateMailbox(input: { email: string; active: boolean; quotaBytes: bigint | null }): Promise<void>;
  updateMailboxPassword(input: { email: string; password: string }): Promise<void>;
  deleteMailbox(input: { email: string }): Promise<void>;
  listAliases(): Promise<AliasRecord[]>;
  createAlias(input: {
    sourceEmail: string;
    destination: string;
    allowSendMailbox?: string;
  }): Promise<void>;
  deleteAlias(input: { sourceEmail: string }): Promise<void>;
  listSenderAcl(): Promise<SenderAclRecord[]>;
  createSenderAcl(input: { mailboxEmail: string; allowedEmail: string }): Promise<void>;
  deleteSenderAcl(input: { mailboxEmail: string; allowedEmail: string }): Promise<void>;
  getDashboardMetrics(): Promise<DashboardMetrics>;
};
