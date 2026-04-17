import { appEnv } from "@/lib/env";
import type { MailAdminProvider } from "@/lib/mailadmin/types";

export async function getMailAdminProvider(): Promise<MailAdminProvider> {
  if (appEnv.driver === "cli") {
    const { cliProvider } = await import("@/lib/mailadmin/cli-provider");
    return cliProvider;
  }

  const { databaseProvider } = await import("@/lib/mailadmin/database-provider");
  return databaseProvider;
}
