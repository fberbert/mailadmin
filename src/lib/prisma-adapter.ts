import { PrismaMariaDb } from "@prisma/adapter-mariadb";

export function createPrismaAdapter() {
  const databaseUrl = process.env.MAILADMIN_DATABASE_URL ?? process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("MAILADMIN_DATABASE_URL or DATABASE_URL is required");
  }

  const adapterUrl = databaseUrl.startsWith("mysql://")
    ? `mariadb://${databaseUrl.slice("mysql://".length)}`
    : databaseUrl;

  return new PrismaMariaDb(adapterUrl);
}
