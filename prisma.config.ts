import fs from "node:fs";
import path from "node:path";

import { parse as parseEnv } from "dotenv";
import { defineConfig } from "prisma/config";

function readProjectEnv() {
  const envPath = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return parseEnv(fs.readFileSync(envPath));
}

const fileEnv = readProjectEnv();
const prismaUrl =
  process.env.PRISMA_DATABASE_URL ??
  fileEnv.PRISMA_DATABASE_URL ??
  process.env.DATABASE_URL ??
  fileEnv.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: prismaUrl,
  },
});
