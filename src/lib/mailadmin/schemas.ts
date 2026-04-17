import { z } from "zod";

export const emailSchema = z.email().transform((value) => value.trim().toLowerCase());

export const domainSchema = z.object({
  name: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Domain must look like a valid hostname"),
});

export const mailboxSchema = z.object({
  email: emailSchema,
  password: z.string().min(4),
  quotaBytes: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? BigInt(value) : null)),
});

export const passwordSchema = z.object({
  email: emailSchema,
  password: z.string().min(4),
});

export const aliasSchema = z.object({
  sourceEmail: emailSchema,
  destination: z.string().trim().min(3),
  allowSendMailbox: z.string().trim().optional(),
});

export const senderAclSchema = z.object({
  mailboxEmail: emailSchema,
  allowedEmail: emailSchema,
});
