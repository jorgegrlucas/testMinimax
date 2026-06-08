# People Manager

App Next.js full-stack para gerir fichas de pessoas (estilo Netwrix Identity Manager).

- **Person** = estado atual (snapshot)
- **PersonRecord** = histórico de postos (cada mudança significativa cria um novo)

## Stack
- Next.js 15 + TypeScript + Tailwind CSS
- Prisma + SQLite (dev.db local)
- React Hook Form + Zod
- shadcn/ui-style components

## Como correr localmente

```bash
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts     # dados de exemplo
npm run dev
```

Abre http://localhost:3000 — redireciona para /people.

## Seed
6 pessoas de exemplo + 5 registos de histórico (Elsa muda de Infra → MOA em 2021, Bob é promovido em 2022).

## Estrutura
```
src/
├── app/                        # rotas
│   ├── layout.tsx              # shell + nav
│   ├── page.tsx                # redirect → /people
│   └── people/
│       ├── page.tsx            # lista + filtros
│       ├── new/page.tsx        # criar
│       └── [id]/
│           ├── page.tsx        # detalhe + histórico
│           └── edit/page.tsx
├── features/people/
│   ├── actions.ts              # server actions (CRUD)
│   ├── queries.ts              # data fetching
│   ├── schemas.ts              # Zod
│   └── components/
│       ├── PersonTable.tsx
│       ├── PersonFilters.tsx
│       ├── PersonForm.tsx
│       └── RecordTimeline.tsx
├── shared/
│   ├── components/ui/          # button, input, card, badge, table, ...
│   └── lib/utils.ts
└── server/db.ts                # Prisma client
```

## Deploy em produção

Para migrar para Postgres (Supabase/Neon):

1. Trocar `provider = "sqlite"` para `"postgresql"` em `prisma/schema.prisma`
2. Definir `DATABASE_URL` no `.env` com a connection string
3. `npx prisma db push`
4. Deploy em Vercel/Railway/Fly.io

Plataformas recomendadas:
- **Vercel** (Next.js nativo, free tier generoso)
- **Railway** (DB Postgres incluído)
- **Fly.io** (global edge)
