-- CreateEnum
CREATE TYPE "public"."ClientType" AS ENUM ('VESSEL_OWNER', 'VESSEL_CHARTERER');

-- CreateEnum
CREATE TYPE "public"."GlobalRole" AS ENUM ('BVS_ADMIN');

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ClientType" NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Membership" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserGlobalRole" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "public"."GlobalRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGlobalRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_key" ON "public"."Client"("name");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "public"."Membership"("userId");

-- CreateIndex
CREATE INDEX "Membership_clientId_idx" ON "public"."Membership"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_clientId_key" ON "public"."Membership"("userId", "clientId");

-- CreateIndex
CREATE INDEX "UserGlobalRole_userId_idx" ON "public"."UserGlobalRole"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGlobalRole_userId_role_key" ON "public"."UserGlobalRole"("userId", "role");

-- AddForeignKey
ALTER TABLE "public"."Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Membership" ADD CONSTRAINT "Membership_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserGlobalRole" ADD CONSTRAINT "UserGlobalRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
