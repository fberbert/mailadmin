import { config as loadEnv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import { createPrismaAdapter } from "../src/lib/prisma-adapter";

loadEnv();

const prisma = new PrismaClient({
  adapter: createPrismaAdapter(),
});

async function main() {
  const domains = ["vivaolinux.com.br", "automatizando.dev", "monetal.com.br"];

  for (const name of domains) {
    await prisma.domain.upsert({
      where: { name },
      update: { active: true },
      create: { name, active: true },
    });
  }

  const fabioViva = await prisma.mailbox.upsert({
    where: { email: "fabio@vivaolinux.com.br" },
    update: { active: true, localPart: "fabio" },
    create: {
      email: "fabio@vivaolinux.com.br",
      localPart: "fabio",
      password: "{SHA512-CRYPT}seed",
      active: true,
      domain: { connect: { name: "vivaolinux.com.br" } },
    },
  });

  const fabioAuto = await prisma.mailbox.upsert({
    where: { email: "fabio@automatizando.dev" },
    update: { active: true, localPart: "fabio" },
    create: {
      email: "fabio@automatizando.dev",
      localPart: "fabio",
      password: "{SHA512-CRYPT}seed",
      active: true,
      domain: { connect: { name: "automatizando.dev" } },
    },
  });

  await prisma.alias.upsert({
    where: { sourceEmail: "contato@monetal.com.br" },
    update: { destination: "fabio@monetal.com.br", active: true },
    create: {
      sourceEmail: "contato@monetal.com.br",
      sourceLocalPart: "contato",
      destination: "fabio@monetal.com.br",
      active: true,
      domain: { connect: { name: "monetal.com.br" } },
    },
  });

  await prisma.senderAcl.upsert({
    where: {
      mailboxId_allowedEmail: {
        mailboxId: fabioViva.id,
        allowedEmail: "postmaster@vivaolinux.com.br",
      },
    },
    update: { active: true },
    create: {
      mailboxId: fabioViva.id,
      allowedEmail: "postmaster@vivaolinux.com.br",
      active: true,
    },
  });

  await prisma.senderAcl.upsert({
    where: {
      mailboxId_allowedEmail: {
        mailboxId: fabioAuto.id,
        allowedEmail: "fabio@automatizando.dev",
      },
    },
    update: { active: true },
    create: {
      mailboxId: fabioAuto.id,
      allowedEmail: "fabio@automatizando.dev",
      active: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
