# BVS API - GitHub Copilot Instructions

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

BVS API is a Node.js 20+ TypeScript REST API built with Fastify web framework, PostgreSQL database, and Prisma ORM. It provides user authentication, client management, and vessel operations for a maritime business verification system.

## Working Effectively

### Bootstrap and Build (REQUIRED FIRST STEPS)

```bash
# 1. Install dependencies - takes ~2 minutes
npm install --ignore-scripts

# 2. Set up environment variables
cp .env.example .env
# Edit .env and set JWT_ACCESS_SECRET to a secure 64-character hex string

# 3. Build the application - takes ~66ms
npm run build
```

**CRITICAL BUILD NOTES:**

- Build is extremely fast (~66ms real time) - no special timeout needed
- Uses tsup to compile TypeScript to ESM format targeting Node.js 20
- Output goes to `dist/` directory (server.js + server.js.map)
- Build works even without Prisma client generated
- **NOTE**: `npx tsc --noEmit` will show TypeScript errors without Prisma types, but build still succeeds

### Database Setup (WITH NETWORK LIMITATIONS)

```bash
# 1. Start PostgreSQL database - takes ~1-2 minutes to pull image first time
docker compose up -d

# 2. Generate Prisma client - FAILS due to network restrictions
npm run prisma:generate
# Expected error: "getaddrinfo ENOTFOUND binaries.prisma.sh"

# 3. Run migrations - FAILS due to network restrictions
npm run prisma:migrate
# Expected error: Same network issue
```

**CRITICAL DATABASE LIMITATION:**

- **Prisma engines CANNOT be downloaded** due to network restrictions blocking `binaries.prisma.sh`
- This prevents: `prisma generate`, `prisma migrate`, `npm run seed`, and `npm run dev`
- **WORKAROUND**: Work with existing generated client or mock database operations
- Database schema is defined in `prisma/schema.prisma` - refer to it for data models

### Development Server

```bash
# Start development server - WILL FAIL without Prisma client
npm run dev
# Expected error: "@prisma/client did not initialize yet"

# Alternative: Build and run production server (also fails without Prisma)
npm run build && npm start
# Expected error: Same Prisma client error during startup
```

**CRITICAL RUNTIME LIMITATION:**

- **ALL server commands fail** without Prisma client: `npm run dev`, `npm start`
- Server fails immediately during startup when loading Prisma plugin
- **Even basic endpoints like `/health` cannot be tested** due to startup failure

### Code Quality (ALWAYS WORKING)

```bash
# Format code - takes ~3 seconds
npm run format

# Check formatting - takes ~3 seconds
npm run format:check

# Lint code - takes ~3.5 seconds
npm run lint

# Fix linting issues - takes ~3.5 seconds
npm run lint:fix
```

**VALIDATION REQUIREMENT:**

- **ALWAYS run `npm run format` and `npm run lint` before committing**
- GitHub Actions workflow will fail if code is not properly formatted or linted

## Validation Scenarios

### API Testing (When Database Works)

1. **Health Check Validation:**

   ```bash
   curl http://localhost:3000/health
   # Expected: {"ok":true}

   curl http://localhost:3000/ready
   # Expected: {"ok":true}

   curl http://localhost:3000/db/ping
   # Expected: {"ok":true} or {"ok":false}
   ```

2. **API Documentation:**
   - Access Swagger UI at: `http://localhost:3000/docs`
   - Verify all endpoints are documented with proper schemas

3. **User Authentication Flow:**
   - Create user via POST `/users`
   - Login via POST `/auth/login`
   - Test protected endpoints with Bearer token
   - Verify JWT token validation

### Manual Code Validation (ALWAYS POSSIBLE)

1. **Build Validation:**

   ```bash
   npm run build
   # Must complete in <1 minute and produce dist/server.js

   ls -la dist/
   # Verify server.js and server.js.map exist
   ```

2. **Code Quality Validation:**

   ```bash
   npm run lint && npm run format:check
   # Both must pass with exit code 0
   ```

3. **Database Connection (When Docker is Running):**

   ```bash
   # Test direct PostgreSQL connection
   PGPASSWORD=postgres psql -h localhost -U postgres -d bvs_api -c "SELECT version();"
   # Expected: Shows PostgreSQL 16.x version info
   ```

4. **Environment Verification:**

   ```bash
   # Verify Node.js version (must be 20+)
   node --version
   # Expected: v20.19.5 or similar

   # Check container status
   docker compose ps
   # Expected: bvs-postgres container running and healthy
   ```

5. **TypeScript Compilation:**
   ```bash
   npx tsc --noEmit
   # Expected: Will show 3 TypeScript errors in authService.ts due to missing Prisma types
   # This is NORMAL without Prisma client - build still works via tsup
   ```

## Technology Stack Details

- **Runtime**: Node.js 20+
- **Language**: TypeScript with ESM modules
- **Web Framework**: Fastify with Zod validation
- **Database**: PostgreSQL with Prisma ORM
- **Build Tool**: tsup (extremely fast ~32ms builds)
- **Code Quality**: ESLint + Prettier
- **Documentation**: Swagger/OpenAPI at `/docs`
- **Authentication**: JWT with bcrypt password hashing

## Project Structure

```
bvs-api/
├── src/
│   ├── modules/          # Feature modules (users, auth)
│   ├── routes/           # System routes (health, db ping)
│   ├── plugins/          # Fastify plugins (security, prisma)
│   ├── config/           # Configuration (auth, logger)
│   ├── shared/           # Shared utilities (crypto, jwt)
│   ├── access/           # Access control logic
│   └── server.ts         # Main application entry point
├── prisma/
│   ├── schema.prisma     # Database schema definition
│   ├── migrations/       # Database migration files
│   └── seed.ts           # Database seeding script
├── dist/                 # Built application (after npm run build)
├── .github/workflows/    # CI/CD (neon-migrate.yml)
└── docker-compose.yml    # PostgreSQL for local development
```

## Environment Variables

Required in `.env` file:

- `NODE_ENV`: development/production
- `PORT`: Server port (default 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_ACCESS_SECRET`: 64-character hex string for JWT signing
- `ACCESS_TOKEN_TTL`: Token expiration (default "1d")

## Common Issues and Solutions

### Network/Prisma Issues

- **Problem**: Cannot download Prisma engines
- **Solution**: Work with schema file directly, avoid `prisma generate`

### Build Issues

- **Problem**: TypeScript compilation errors without Prisma
- **Expected**: 3 TypeScript errors in `authService.ts` are NORMAL without Prisma types
- **Solution**: Use `npm run build` instead of `npx tsc --noEmit` for compilation

### Code Quality Issues

- **Problem**: CI fails on formatting/linting
- **Solution**: Always run `npm run format && npm run lint:fix` before committing

## Development Workflow

**IMPORTANT: Due to Prisma network limitations, the complete runtime workflow cannot be tested, but code development and validation can proceed normally.**

### Complete Validated Workflow:

1. **Make code changes**
2. **Build and validate**: `npm run build`
3. **Check code quality**: `npm run lint:fix && npm run format`
4. **Manual validation**: Check built files in `dist/`
5. **Environment check**: `docker compose ps` (verify database)
6. **Direct DB test**: `PGPASSWORD=postgres psql -h localhost -U postgres -d bvs_api -c "SELECT 1;"`
7. **Commit changes** after all validations pass

### If Prisma Engines Were Available (Network Unrestricted):

1. Run `npm run prisma:generate` (generate client)
2. Run `npm run prisma:migrate` (apply schema changes)
3. Run `npm run seed` (populate test data)
4. Start server with `npm run dev`
5. Test API endpoints at `http://localhost:3000/docs`
6. Validate authentication flows and user scenarios

## Quick Reference Commands

| Command                        | Purpose             | Time    | Status             |
| ------------------------------ | ------------------- | ------- | ------------------ |
| `npm install --ignore-scripts` | Install deps safely | ~2min   | ✅ Works           |
| `npm run build`                | Build app           | ~66ms   | ✅ Works           |
| `npm run lint`                 | Check linting       | ~3.5s   | ✅ Works           |
| `npm run format`               | Format code         | ~3s     | ✅ Works           |
| `docker compose up -d`         | Start PostgreSQL    | ~1-2min | ✅ Works           |
| `npm run prisma:generate`      | Generate client     | -       | ❌ Network blocked |
| `npm run dev`                  | Start dev server    | -       | ❌ Needs Prisma    |

**Remember: The application builds and validates correctly, but requires Prisma client generation for runtime which is blocked by network restrictions.**
