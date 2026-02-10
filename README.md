# Prizma - BPO e Contabilidade

Aplicação web PWA multi-tenant para escritórios de contabilidade e seus clientes. Inclui integração com Nibo (ERP) e WhatsApp via Evolution API.

## Stack

- **Frontend:** Next.js (App Router), MUI, TypeScript
- **Auth e Banco:** Supabase (Auth, PostgreSQL, RLS)
- **Hospedagem:** Vercel
- **Integrações:** Nibo API, Evolution API (WhatsApp)

## Pré-requisitos

- Node.js 18+
- Conta Supabase
- (Opcional) Instância Evolution API para WhatsApp
- (Opcional) Plano Premium Nibo para integração

## Configuração

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente e preencha as variáveis:

```bash
cp .env.example .env.local
```

Variáveis obrigatórias:

- `NEXT_PUBLIC_SUPABASE_URL` – URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Chave anon do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` – Chave service role (cadastro de escritório)

Variáveis opcionais:

- `EVOLUTION_API_URL` – URL da sua Evolution API (WhatsApp)
- `EVOLUTION_API_KEY` – Chave global da Evolution (se não configurar por tenant)

3. Aplique as migrations no Supabase:

- No Dashboard do Supabase, vá em SQL Editor e execute, em ordem, os arquivos em `supabase/migrations/`.

4. No Supabase, configure o provedor Google em Authentication > Providers para login com Google.

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Fluxos principais

- **Cadastro:** Página inicial > "Cadastrar escritório" > preencha nome, e-mail e senha > primeiro usuário vira admin do tenant.
- **Login:** E-mail/senha ou Google; redirecionamento por perfil (escritório → dashboard, cliente → portal).
- **Dashboard:** Clientes (listar/cadastrar/excluir), Configurações (Evolution API), Integrações (Nibo + sync).
- **Portal:** Área do cliente (dados vinculados ao seu usuário).
- **Webhook Evolution:** `POST /api/webhooks/evolution` – configure esta URL na Evolution API para receber eventos.

## Estrutura

- `src/app/(auth)` – Login e cadastro
- `src/app/(dashboard)` – Área do escritório (multi-tenant)
- `src/app/(portal)` – Área do cliente
- `src/app/api` – Route Handlers (auth callback, signout, webhook)
- `src/lib` – Supabase, Nibo, Evolution, auth
- `supabase/migrations` – Schema e RLS

## Deploy (Vercel)

Configure as mesmas variáveis de ambiente no projeto Vercel e faça o deploy. A URL do webhook Evolution será `https://seu-dominio.vercel.app/api/webhooks/evolution`.
