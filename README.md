# mailadmin panel

Painel web em `Next.js` para administrar o backend de e-mail virtual do servidor `five`.

O projeto cobre:

- domínios
- mailboxes
- aliases
- `sender_acl`
- autenticação simples para o painel
- execução local com `docker compose`
- dois drivers de dados:
  - `database`: opera direto no banco `mailserver`/`mailadmin`
  - `cli`: usa o utilitário legado `mailadmin`

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Prisma`
- `MySQL 8`
- `Docker Compose`

## Estrutura

```text
src/app/(dashboard)   rotas protegidas do painel
src/lib/mailadmin     camada de providers (database e cli)
prisma/               schema e seed local
legacy/               utilitário mailadmin trazido do five como referência
```

## Fluxo recomendado

Desenvolvimento local:

1. subir `docker compose`
2. usar o driver `database`
3. validar UX e regras de CRUD

Deploy futuro no `five`:

1. ajustar `.env`
2. trocar `MAILADMIN_DRIVER=cli` ou apontar `DATABASE_URL` para o backend real
3. publicar atrás do Apache/Nginx

## Variáveis de ambiente

Copie `.env.example` para `.env` se for rodar fora do Docker.

```env
DATABASE_URL="mysql://mailadmin:mailadmin@db:3306/mailadmin"
PRISMA_DATABASE_URL="mysql://mailadmin:mailadmin@db:3306/mailadmin"
MAILADMIN_DATABASE_URL="mysql://mailadmin:mailadmin@db:3306/mailadmin"
MAILADMIN_DRIVER="database"
AUTH_SECRET="change-me-in-production"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
MAILADMIN_CLI_PATH="mailadmin"
MAILADMIN_CLI_PREFIX=""
APP_URL="http://localhost:3000"
```

## Rodando com Docker Compose

```bash
docker compose up --build
```

Serviços:

- painel: `http://localhost:3000`
- MySQL local: `127.0.0.1:3406`

Credenciais padrão do painel:

- usuário: `admin`
- senha: `admin123`

O container da aplicação executa automaticamente:

- `npm install`
- `prisma generate`
- `prisma db push`
- `npm run db:seed`
- `next dev`

## Rodando sem Docker

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## Modelo de dados

### domains

- nome do domínio
- flag `active`

### mailboxes

- endereço completo
- `local_part`
- senha
- quota opcional
- flag `active`

### aliases

- endereço de origem
- destino
- flag `active`

### sender_acl

- mailbox autenticada
- endereço permitido no `MAIL FROM`

Regra importante:

- `mailbox add` cria automaticamente a permissão principal de envio para o próprio endereço da mailbox

## Drivers

### database

Usado no desenvolvimento local. Faz CRUD direto no banco via Prisma.

### cli

Pensado para o ambiente do `five`. Faz shell-out para o utilitário legado `mailadmin`.

Variáveis relevantes:

```env
MAILADMIN_DRIVER=cli
MAILADMIN_CLI_PATH=/usr/local/bin/mailadmin
MAILADMIN_CLI_PREFIX=sudo
```

## Healthcheck

Endpoint simples:

```text
GET /api/health
```

Resposta:

```json
{
  "ok": true,
  "mode": "database",
  "timestamp": "2026-04-17T03:00:00.000Z"
}
```

## Referência do utilitário legado

O utilitário original do `five` foi copiado para:

- `legacy/mailadmin`
- `legacy/mailadmin-help.txt`

Ele está no repositório como referência operacional e para alimentar o provider `cli`.

## Qualidade

Checks locais:

```bash
npm run lint
npm run build
```

Também existe workflow de CI em `.github/workflows/ci.yml`.

## Limites atuais

- autenticação do painel é simples e baseada em cookie assinado
- o driver `cli` depende do formato de saída do utilitário legado
- o hashing de senha do driver `database` é apenas adequado para desenvolvimento local

## Próximos passos naturais

- RBAC por usuário do painel
- auditoria de alterações
- paginação e filtros
- importação/exportação
- dashboards com saúde do mail server
