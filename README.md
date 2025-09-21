# BVS API

A modern TypeScript REST API built with Fastify, featuring user management, database integration with Prisma ORM, and comprehensive swagger API documentation.

## 🚀 Features

- **Fast & Lightweight**: Built with Fastify for high performance
- **Type-Safe**: Full TypeScript support with Zod schema validation
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Authentication**: JWT-based authentication with Bearer tokens
- **Authorization**: Role-based access control (RBAC) with global roles and client memberships
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation with authentication support
- **Security**: Built-in CORS, Helmet, and security plugins
- **Development Tools**: Hot reload, linting, formatting, and more
- **Docker Ready**: Docker Compose setup for easy development

## 📋 Prerequisites

- Node.js >= 20.0.0
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bvs-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your database connection and other settings.

4. **Set up the database**
   ```bash
   npm run prisma:migrate
   npm run seed
   ```

## ⚙️ Environment Configuration

The application uses the following environment variables:

| Variable            | Description                  | Default                 |
| ------------------- | ---------------------------- | ----------------------- |
| `NODE_ENV`          | Environment mode             | `development`           |
| `PORT`              | Server port                  | `3000`                  |
| `DATABASE_URL`      | PostgreSQL connection string | See `.env.example`      |
| `JWT_ACCESS_SECRET` | JWT signing secret           | `paste-hex-secret-here` |
| `ACCESS_TOKEN_TTL`  | JWT expiration time          | `1d`                    |
| `CORS_ORIGIN`       | CORS allowed origins         | `*`                     |
| `SENTRY_DSN`        | Sentry error tracking DSN    | (optional)              |

### JWT Configuration

For JWT authentication, you need to generate a strong secret:

```bash
# Using OpenSSL
openssl rand -hex 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update your `.env` file with the generated secret:

```env
JWT_ACCESS_SECRET="your-generated-secret-here"
ACCESS_TOKEN_TTL="1d"  # or "15m", "1h", "7d", etc.
```

## 🚀 Development

### Available Scripts

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start development server with hot reload |
| `npm run build`           | Build for production                     |
| `npm start`               | Start production server                  |
| `npm run lint`            | Run ESLint                               |
| `npm run lint:fix`        | Fix ESLint issues                        |
| `npm run format`          | Format code with Prettier                |
| `npm run format:check`    | Check code formatting                    |
| `npm run prisma:reset`    | Reset database and run migrations        |
| `npm run prisma:migrate`  | Run database migrations                  |
| `npm run prisma:generate` | Generate Prisma client                   |
| `npm run prisma:studio`   | Open Prisma Studio                       |
| `npm run seed`            | Seed the database                        |

### Development Workflow

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Make your changes** - The server will automatically reload

3. **Format and lint your code**

   ```bash
   npm run format
   npm run lint:fix
   ```

4. **Run database migrations** (if you modify the schema)
   ```bash
   npm run prisma:migrate
   ```

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:3000/docs`

## 🔐 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication and implements role-based access control (RBAC).

### Authentication Flow

1. **Register or Login** to get an access token
2. **Include the token** in the Authorization header: `Bearer <your-token>`
3. **Access protected endpoints** with your authenticated requests

### User Roles & Permissions

#### Global Roles

- **BVS_ADMIN**: Full system access, can perform all operations

#### Client Types & Memberships

- **VESSEL_OWNER**: Can view users within their organization type
- **VESSEL_CHARTERER**: Can view users within their organization type

### Authentication Endpoints

#### Register a New User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <your-token>
```

Response:

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "access": {
    "isBvsAdmin": false,
    "memberships": [
      {
        "clientId": "uuid",
        "clientType": "VESSEL_OWNER"
      }
    ]
  }
}
```

### Using Protected Endpoints

Include the JWT token in the Authorization header:

```http
GET /users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test Users (from seed data)

The following test users are created when you run `npm run seed`:

| Role             | Email                 | Password    | Description         |
| ---------------- | --------------------- | ----------- | ------------------- |
| BVS Admin        | `admin@bvs.com`       | `test12345` | Full system access  |
| BVS Admin        | `admin2@test.com`     | `test12345` | Full system access  |
| Vessel Owner     | `owner1@test.com`     | `test12345` | OwnerCo member      |
| Vessel Owner     | `owner2@test.com`     | `test12345` | OwnerCo2 member     |
| Vessel Charterer | `charterer1@test.com` | `test12345` | ChartererCo member  |
| Vessel Charterer | `charterer2@test.com` | `test12345` | ChartererCo2 member |

### Available Endpoints

#### System Endpoints

- `GET /health` - API health check
- `GET /ready` - Readiness check

#### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password
- `GET /auth/me` - Get current user info (requires authentication)

#### User Management (Protected)

All user endpoints require authentication. Authorization rules apply:

- **Admins**: Full access to all operations
- **Vessel Owners/Charterers**: Can only view users within their client type

- `GET /users` - List users with role-based filtering
- `GET /users/:id` - Get user by ID (with access control)
- `POST /users` - Create a new user (admin only)
- `PATCH /users/:id` - Update user by ID (admin only)
- `DELETE /users/:id` - Delete user by ID (admin only)

#### Database

- `GET /db/ping` - Database connectivity check

## 🗄️ Database

The application uses PostgreSQL with Prisma as the ORM. The database schema includes a comprehensive user management system with role-based access control.

### Core Models

#### User Model

```typescript
model User {
  id           String   @id @default(uuid()) @db.Uuid
  email        String   @unique
  firstName    String?
  lastName     String?
  avatarUrl    String?
  passwordHash String   // REQUIRED for local auth
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  memberships Membership[]
  globalRoles UserGlobalRole[]
}
```

#### Client Model

```typescript
model Client {
  id        String     @id @default(uuid()) @db.Uuid
  name      String     @unique
  type      ClientType // VESSEL_OWNER | VESSEL_CHARTERER
  logoUrl   String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  memberships Membership[]
}
```

#### Membership Model

```typescript
model Membership {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  clientId  String   @db.Uuid
  createdAt DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  client Client @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@unique([userId, clientId])
}
```

#### UserGlobalRole Model

```typescript
model UserGlobalRole {
  id        String     @id @default(uuid()) @db.Uuid
  userId    String     @db.Uuid
  role      GlobalRole // BVS_ADMIN
  createdAt DateTime   @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, role])
}
```

### Enums

```typescript
enum ClientType {
  VESSEL_OWNER
  VESSEL_CHARTERER
}

enum GlobalRole {
  BVS_ADMIN
}
```

### Database Commands

```bash
# Generate Prisma client after schema changes
npm run prisma:generate

# Create and apply new migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Seed the database with initial data
npm run seed
```

## 📁 Project Structure

```
bvs-api/
├── src/
│   ├── access/          # Access control utilities
│   │   └── accessControl.ts
│   ├── config/          # Configuration files
│   │   ├── auth.ts      # JWT configuration
│   │   └── logger.ts    # Logging configuration
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication module
│   │   │   ├── authController.ts
│   │   │   ├── authRoute.ts
│   │   │   ├── authSchemas.ts
│   │   │   ├── authService.ts
│   │   │   └── requireAuth.ts
│   │   └── users/       # User management module
│   │       ├── userController.ts
│   │       ├── userRoute.ts
│   │       ├── userSchemas.ts
│   │       └── userService.ts
│   ├── plugins/         # Fastify plugins
│   │   ├── prisma.ts    # Database plugin
│   │   └── security.ts  # Security middleware
│   ├── routes/          # System routes
│   │   ├── dbRoute.ts   # Database health checks
│   │   └── systemRoute.ts
│   ├── shared/          # Shared utilities
│   │   ├── crypto.ts    # Password hashing
│   │   ├── jwt.ts       # JWT utilities
│   │   └── errors/      # Error handling
│   ├── types/           # TypeScript type definitions
│   │   ├── fastify.d.ts # Fastify augmentations
│   │   └── uuid.ts      # UUID utilities
│   └── server.ts        # Main application entry point
├── prisma/
│   ├── migrations/      # Database migrations
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding script
├── dist/                # Built application (after npm run build)
├── docker-compose.yml   # Docker services configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── eslint.config.mjs    # ESLint configuration
└── .prettierrc          # Prettier configuration
```

## 🐳 Docker Development

Use Docker Compose for local development with PostgreSQL:

```bash
# Start PostgreSQL database
docker-compose up -d

# The API will connect to the database running in Docker
npm run dev
```

## 🚀 Production Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set production environment variables**
   - Ensure `NODE_ENV=production`
   - Generate a strong `JWT_ACCESS_SECRET` (use the commands in Environment Configuration)
   - Configure appropriate `ACCESS_TOKEN_TTL` (recommended: `1h` or `24h`)
   - Set secure `DATABASE_URL` with SSL
   - Configure `CORS_ORIGIN` with your domain(s)

3. **Run database migrations**

   ```bash
   npm run prisma:migrate
   ```

4. **Seed the database** (optional for production)

   ```bash
   npm run seed
   ```

   **Note**: The seed creates test users with the password `test12345`. For production, either:
   - Skip seeding and create admin users manually
   - Change the default password in the seed script
   - Remove test users after creating proper admin accounts

5. **Start the production server**
   ```bash
   npm start
   ```

### Security Considerations

- Use a strong, unique `JWT_ACCESS_SECRET` in production
- Set appropriate `ACCESS_TOKEN_TTL` (balance security vs. user experience)
- Configure `CORS_ORIGIN` to specific domains
- Use HTTPS in production
- Regularly rotate JWT secrets
- Monitor authentication logs
- Implement rate limiting for auth endpoints

## 🔧 Technology Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Web Framework**: Fastify
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Code Quality**: ESLint + Prettier
- **Build Tool**: tsup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`, `npm run format`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure PostgreSQL is running
   - Check your `DATABASE_URL` in `.env`
   - Verify database exists and is accessible

2. **Build errors**
   - Run `npm run prisma:generate` to regenerate Prisma client
   - Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`

3. **Port already in use**
   - Change the `PORT` environment variable
   - Kill existing processes: `lsof -ti:3000 | xargs kill`

4. **Authentication errors**
   - Verify `JWT_ACCESS_SECRET` is set in `.env`
   - Ensure the secret is at least 32 characters long (64 hex characters recommended)
   - Check token expiration (`ACCESS_TOKEN_TTL`)
   - Verify Bearer token format: `Authorization: Bearer <token>`

5. **Authorization errors (403 Forbidden)**
   - Check user roles: Use `/auth/me` to verify user permissions
   - Ensure proper client memberships for non-admin users
   - Admin operations require `BVS_ADMIN` global role

6. **Prisma/Database migration issues**
   - Reset database: `npm run prisma:reset`
   - Regenerate client: `npm run prisma:generate`
   - Re-seed database: `npm run seed`

### Development Tips

- Use `npm run prisma:studio` to visually inspect your database
- Check the Swagger documentation at `/docs` for API details
- Monitor logs in development mode for debugging
- Use environment-specific configurations for different deployment stages
- Test authentication with the provided seed users
- Use `/auth/me` endpoint to verify token validity and user permissions
