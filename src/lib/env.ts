const required = (name: string, fallback?: string) => {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const appEnv = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  driver: (process.env.MAILADMIN_DRIVER ?? "database") as "database" | "cli",
  authSecret: required("AUTH_SECRET", "dev-secret-change-me"),
  adminUsername: required("ADMIN_USERNAME", "admin"),
  adminPassword: required("ADMIN_PASSWORD", "admin123"),
  cliPath: process.env.MAILADMIN_CLI_PATH ?? "mailadmin",
  cliPrefix: process.env.MAILADMIN_CLI_PREFIX ?? "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};
