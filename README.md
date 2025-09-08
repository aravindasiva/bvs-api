# BVS API

A modern TypeScript REST API built with Fastify, featuring user management, database integration with Prisma ORM, and comprehensive swagger API documentation.

## 🚀 Features

- **Fast & Lightweight**: Built with Fastify for high performance
- **Type-Safe**: Full TypeScript support with Zod schema validation
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
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

| Variable         | Description                  | Default                  |
| ---------------- | ---------------------------- | ------------------------ |
| `NODE_ENV`       | Environment mode             | `development`            |
| `PORT`           | Server port                  | `3000`                   |
| `DATABASE_URL`   | PostgreSQL connection string | See `.env.example`       |
| `JWT_SECRET`     | JWT signing secret           | `change-me-super-secret` |
| `JWT_ALG`        | JWT algorithm                | `HS256`                  |
| `JWT_ISSUER`     | JWT issuer                   | `bvs-api`                |
| `JWT_AUDIENCE`   | JWT audience                 | `bvs-api`                |
| `JWT_EXPIRES_IN` | JWT expiration time          | `15m`                    |
| `CORS_ORIGIN`    | CORS allowed origins         | `*`                      |
| `SENTRY_DSN`     | Sentry error tracking DSN    | (optional)               |

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
| `npm run prisma:generate` | Generate Prisma client                   |
| `npm run prisma:migrate`  | Run database migrations                  |
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

### Available Endpoints

#### System Endpoints

- `GET /health` - API health check
- `GET /ready` - Readiness check

#### User Management

- `GET /users` - List all users with pagination
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PATCH /users/:id` - Update user by ID
- `DELETE /users/:id` - Delete user by ID

#### Database

- `GET /db/health` - Database health check

## 🗄️ Database

The application uses PostgreSQL with Prisma as the ORM. The database schema includes:

### User Model

```typescript
model User {
  id         String
  email      String
  firstName  String?
  lastName   String?
  avatarUrl  String?
  createdAt  DateTime
  updatedAt  DateTime
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
│   ├── config/          # Configuration files
│   ├── modules/         # Feature modules
│   │   └── users/       # User management module
│   ├── plugins/         # Fastify plugins
│   ├── routes/          # System routes
│   ├── shared/          # Shared utilities
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
   - Configure secure `JWT_SECRET`
   - Set appropriate `DATABASE_URL`
   - Configure `CORS_ORIGIN` with your domain

3. **Run database migrations**

   ```bash
   npm run prisma:migrate
   ```

4. **Start the production server**
   ```bash
   npm start
   ```

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

### Development Tips

- Use `npm run prisma:studio` to visually inspect your database
- Check the Swagger documentation at `/docs` for API details
- Monitor logs in development mode for debugging
- Use environment-specific configurations for different deployment stages
