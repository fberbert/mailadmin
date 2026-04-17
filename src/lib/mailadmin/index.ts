import { appEnv } from "@/lib/env";
import { cliProvider } from "@/lib/mailadmin/cli-provider";
import { databaseProvider } from "@/lib/mailadmin/database-provider";

export const mailAdminProvider =
  appEnv.driver === "cli" ? cliProvider : databaseProvider;
