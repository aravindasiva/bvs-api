# BVS API

A modern TypeScript REST API built with Fastify, Prisma (PostgreSQL), JWT authentication, and role-based access control (RBAC).

- Live API Docs (Production): https://bvs-api.onrender.com/docs
- Local API Docs: http://localhost:3000/docs

## Features

- Fastify + TypeScript + Zod validation
- PostgreSQL via Prisma ORM
- JWT auth with secure password hashing
- RBAC: global roles (e.g., BVS_ADMIN) and client-type scoped memberships
- Swagger/OpenAPI docs
- Ready-to-use dev scripts and Docker Compose for local DB

## Quick Start (Local)

1. Clone and install

```bash
git clone <repository-url>
cd bvs-api
npm install
```

2. Configure environment

```bash
cp .env.example .env
# edit .env with your DATABASE_URL and JWT_* values
```

3. Setup database

```bash
npm run prisma:migrate
npm run seed
```

4. Run the API

```bash
npm run dev
# Open http://localhost:3000/docs
```

## Environment

| Variable       | Description                | Example/Default  |
| -------------- | -------------------------- | ---------------- |
| NODE_ENV       | Environment mode           | development      |
| PORT           | Server port                | 3000             |
| DATABASE_URL   | Postgres connection string | see .env.example |
| JWT_SECRET     | JWT signing secret         | change-me        |
| JWT_ISSUER     | JWT issuer                 | bvs-api          |
| JWT_AUDIENCE   | JWT audience               | bvs-api          |
| JWT_EXPIRES_IN | Access token TTL           | 15m              |
| CORS_ORIGIN    | Allowed origins            | \*               |

## API Overview

- Swagger UI: /docs
- Health: GET /health, GET /ready, GET /db/health

Auth

- POST /auth/register
- POST /auth/login → returns a JWT containing:
  - roles: string[]
  - memberships: [{ clientId, clientType }]
- GET /auth/me

Users

- GET /users (pagination: limit, offset)
  - Admin: all users
  - Non-admin: only users that share your clientType via membership
- GET /users/:id
  - Admin: any user
  - Non-admin: allowed if the target user has a membership with the same clientType
- POST /users, PATCH /users/:id, DELETE /users/:id (admin only)

## Seeding

The seed creates:

- Admins: admin@bvs.com, admin2@test.com
- Owners: owner1@test.com, owner2@test.com
- Charterers: charterer1@test.com, charterer2@test.com
- Clients: OwnerCo, OwnerCo2 (VESSEL_OWNER), ChartererCo, ChartererCo2 (VESSEL_CHARTERER)
- Memberships: each owner/charterer is linked to their respective client
- Default password (all seeded users): test12345

## Architecture (High-Level)

```
Client (Frontend or API consumer)
        |
        v
   Fastify Server
   - Routes (auth, users, system)
   - Zod validation
   - JWT middleware (requireAuth)
   - RBAC checks (admin vs clientType scope)
        |
        v
     Services
   - Business logic
   - Data selection/mapping
        |
        v
     Prisma ORM
   - PostgreSQL
   - Models: User, Client, Membership, UserGlobalRole
```

Concepts

- Global roles live on the user (e.g., BVS_ADMIN).
- Memberships associate users to clients; each client has a type (VESSEL_OWNER or VESSEL_CHARTERER).
- Non-admin access is scoped by matching clientType with the target resource.

## Project Structure

```
bvs-api/
├── src/
│   ├── modules/         # Feature modules (auth, users, etc.)
│   ├── shared/          # Utilities (crypto, jwt, etc.)
│   ├── plugins/         # Fastify plugins
│   ├── routes/          # System routes
│   └── server.ts        # App entry point
├── prisma/
│   ├── migrations/      # Database migrations
│   ├── schema.prisma    # Prisma schema
│   └── seed.ts          # Seed script
├── docker-compose.yml   # Local Postgres
├── package.json         # Scripts and deps
└── tsconfig.json
```

## Tech Stack

- Node.js 20+, TypeScript, Fastify
- PostgreSQL + Prisma
- Zod for validation
- Swagger/OpenAPI
- ESLint + Prettier
- tsup for builds

## Deploying

General steps:

1. Build: `npm run build`
2. Provide production env vars (DATABASE_URL, JWT_*, CORS_ORIGIN, PORT, NODE_ENV=production)
3. Run migrations: `npm run prisma:migrate`
4. Start: `npm start`

This project is compatible with popular platforms like Render (for the API) and Neon (for managed Postgres). Point your service at the production database URL, run migrations during deploy, and expose `/docs` for API docs.

## License

Private and proprietary.

---

Made with ❤ by [aravindasiva](https://github.com/aravindasiva)
