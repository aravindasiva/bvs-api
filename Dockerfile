# Base image with OpenSSL (needed by Prisma engines)
FROM node:20-bookworm-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# 1) Install deps WITHOUT running postinstall (no schema yet)
FROM base AS deps
COPY package*.json ./
# Avoid running "postinstall" here (it would fail prisma generate)
RUN npm ci --ignore-scripts

# 2) Build stage: copy source, generate Prisma Client, build, then prune dev deps
FROM deps AS build
COPY . .
# Generate Prisma Client now that prisma/schema.prisma exists
RUN npx prisma generate
# Build your app (adjust if your build script differs)
RUN npm run build
# Keep only production deps (preserves generated Prisma client)
RUN npm prune --omit=dev

# 3) Final runtime image (small, production-only)
FROM node:20-bookworm-slim AS runner
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy pruned node_modules with generated Prisma client
COPY --from=build /app/node_modules ./node_modules
# App artifacts
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist
# Optional: not needed at runtime, but harmless to keep
# COPY --from=build /app/prisma ./prisma

EXPOSE 3000
# Adjust the entrypoint if your compiled file differs
CMD ["node", "dist/server.js"]
