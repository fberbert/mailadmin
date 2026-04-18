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

## Trazer um domínio para o `five`

O `mailadmin` resolve a parte interna do mail server:

- domínio ativo no banco
- mailbox(es)
- aliases
- sender ACL

O DNS continua sendo responsabilidade operacional externa ao painel.

### Ordem recomendada

1. adicionar o domínio no backend do mail server
2. criar a mailbox principal
3. criar aliases operacionais (`postmaster`, `abuse`, `dmarc`, `contato`)
4. gerar/publicar DKIM
5. publicar `MX`, `SPF` e `DMARC`
6. validar com `dig`, `exim -bt` e um envio real

### 1. Cadastrar o domínio e a mailbox

No `five`:

```bash
sudo mailadmin domain add example.com
sudo mailadmin mailbox add fabio@example.com --password 'senha-temporaria'
sudo mailadmin alias add postmaster@example.com fabio@example.com --allow-send fabio@example.com
sudo mailadmin alias add abuse@example.com fabio@example.com --allow-send fabio@example.com
sudo mailadmin alias add dmarc@example.com fabio@example.com --allow-send fabio@example.com
sudo mailadmin alias add contato@example.com fabio@example.com --allow-send fabio@example.com
```

Observação importante:

- no estado atual do `five`, o Exim usa o banco `mailserver` como fonte de verdade para domínios virtuais
- `dc_other_hostnames` não precisa ser sincronizado por domínio

### 2. Gerar DKIM no `five`

O Exim do `five` usa o seletor `mail2026` e o mapa:

- `/etc/exim4/dkim/privatekey.map`

Fluxo sugerido para um domínio novo:

```bash
sudo install -d -m 750 -o root -g Debian-exim /etc/exim4/dkim/example.com
sudo openssl genrsa -out /etc/exim4/dkim/example.com/mail2026.private 2048
sudo openssl rsa -in /etc/exim4/dkim/example.com/mail2026.private -pubout -out /etc/exim4/dkim/example.com/mail2026.public
sudo chown root:Debian-exim /etc/exim4/dkim/example.com/mail2026.private
sudo chmod 640 /etc/exim4/dkim/example.com/mail2026.private
sudo sh -c \"grep -q '^example.com:' /etc/exim4/dkim/privatekey.map || printf '%s: %s\\n' 'example.com' '/etc/exim4/dkim/example.com/mail2026.private' >> /etc/exim4/dkim/privatekey.map\"
sudo systemctl reload exim4
```

Extrair a chave pública para publicar no DNS:

```bash
sudo awk 'NF && $0 !~ /BEGIN PUBLIC KEY|END PUBLIC KEY/ { printf \"%s\", $0 }' /etc/exim4/dkim/example.com/mail2026.public
```

O valor retornado entra no `p=` do TXT DKIM.

### 3. Registros DNS mínimos

Assumindo que o servidor de e-mail continua sendo o `five` em `52.35.188.239` e que os clientes vão usar `mail2.vivaolinux.com.br`:

#### MX

```dns
example.com.  MX  10 mail2.vivaolinux.com.br.
```

#### SPF

```dns
example.com.  TXT  "v=spf1 ip4:52.35.188.239 -all"
```

#### DKIM

```dns
mail2026._domainkey.example.com.  TXT  "v=DKIM1; k=rsa; p=CHAVE_PUBLICA_AQUI"
```

#### DMARC

Começo conservador:

```dns
_dmarc.example.com.  TXT  "v=DMARC1; p=none; adkim=s; aspf=s; pct=100; fo=1; rua=mailto:dmarc@example.com"
```

Depois de validar entrega/autenticação:

```dns
_dmarc.example.com.  TXT  "v=DMARC1; p=quarantine; adkim=s; aspf=s; pct=100; fo=1; rua=mailto:dmarc@example.com"
```

### 4. O que apagar ao migrar de outro provedor

Antes de fechar a migração, revise e remova:

- `MX` antigo apontando para SES, Google Workspace, cPanel, etc.
- múltiplos registros `SPF` no domínio raiz
- `SPF` legado de `amazonses.com`, `sendgrid.net` ou outro serviço que não envia mais
- `DKIM` legado de provedores que não estão mais em uso

Regra importante:

- o domínio raiz deve ter **um único SPF válido**

### 5. Como consultar os registros com `dig`

```bash
dig +short MX example.com
dig +short TXT example.com
dig +short TXT mail2026._domainkey.example.com
dig +short TXT _dmarc.example.com
```

Usando um resolvedor específico:

```bash
dig @8.8.8.8 +short TXT mail2026._domainkey.example.com
dig @1.1.1.1 +short TXT _dmarc.example.com
```

### 6. Validação no servidor

No `five`:

```bash
sudo mailadmin domain list
sudo mailadmin mailbox list --domain example.com
sudo mailadmin alias list --domain example.com
sudo mailadmin sender-allow list fabio@example.com
sudo doveadm auth test fabio@example.com
sudo exim -bt fabio@example.com
```

Esperado:

- `doveadm auth test` autentica a mailbox
- `exim -bt fabio@example.com` cai em `virtual_mailboxes_sql`

### 7. Validação de entrega

Depois da propagação:

1. envie um e-mail de `fabio@example.com` para Gmail ou Outlook
2. confira no provedor de destino se:
   - `SPF = PASS`
   - `DKIM = PASS`
   - `DMARC = PASS`

### 8. Observações operacionais

- o certificado TLS atual do servidor é de `mail2.vivaolinux.com.br`
- por isso, os clientes devem usar `mail2.vivaolinux.com.br` em IMAP/SMTP
- não é recomendado publicar `mail.example.com` para cliente a menos que o certificado também cubra esse hostname

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
