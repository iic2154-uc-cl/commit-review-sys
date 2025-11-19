-- CreateEnum
CREATE TYPE "ReviewBy" AS ENUM ('HUMAN', 'AI');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'ASSISTANT', 'EXPERT', 'LEADER', 'STUDENT', 'GUEST');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'GUEST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gitusers" (
    "gitName" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "gitusers_pkey" PRIMARY KEY ("gitName")
);

-- CreateTable
CREATE TABLE "repos" (
    "name" TEXT NOT NULL,

    CONSTRAINT "repos_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "RepoOnUser" (
    "id" SERIAL NOT NULL,
    "gitName" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepoOnUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commitreviews" (
    "id" SERIAL NOT NULL,
    "sha" VARCHAR(255) NOT NULL,
    "repoOnUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "reviewBy" "ReviewBy" NOT NULL DEFAULT 'AI',
    "reviewer" VARCHAR(255) NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "suggested" VARCHAR(255) NOT NULL,
    "adherence" INTEGER NOT NULL DEFAULT 0,
    "adherence_comment" TEXT NOT NULL DEFAULT '',
    "vulnerability" INTEGER NOT NULL DEFAULT 0,
    "vulnerability_comment" TEXT NOT NULL DEFAULT '',
    "complexity_comment" TEXT NOT NULL DEFAULT '',
    "singleResponsibility" INTEGER NOT NULL DEFAULT 0,
    "openClosed" INTEGER NOT NULL DEFAULT 0,
    "liskovSubstitution" INTEGER NOT NULL DEFAULT 0,
    "interfaceSegregation" INTEGER NOT NULL DEFAULT 0,
    "dependencyInversion" INTEGER NOT NULL DEFAULT 0,
    "singleResponsibility_comment" TEXT NOT NULL DEFAULT '',
    "openClosed_comment" TEXT NOT NULL DEFAULT '',
    "interfaceSegregation_comment" TEXT NOT NULL DEFAULT '',
    "liskovSubstitution_comment" TEXT NOT NULL DEFAULT '',
    "dependencyInversion_comment" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "commitreviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "gitusers_gitName_key" ON "gitusers"("gitName");

-- CreateIndex
CREATE UNIQUE INDEX "gitusers_userId_key" ON "gitusers"("userId");

-- CreateIndex
CREATE INDEX "gitusers_gitName_userId_idx" ON "gitusers"("gitName", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "repos_name_key" ON "repos"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RepoOnUser_gitName_repoName_key" ON "RepoOnUser"("gitName", "repoName");

-- CreateIndex
CREATE INDEX "commitreviews_sha_repoOnUserId_idx" ON "commitreviews"("sha", "repoOnUserId");

-- AddForeignKey
ALTER TABLE "gitusers" ADD CONSTRAINT "gitusers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepoOnUser" ADD CONSTRAINT "RepoOnUser_repoName_fkey" FOREIGN KEY ("repoName") REFERENCES "repos"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepoOnUser" ADD CONSTRAINT "RepoOnUser_gitName_fkey" FOREIGN KEY ("gitName") REFERENCES "gitusers"("gitName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commitreviews" ADD CONSTRAINT "commitreviews_repoOnUserId_fkey" FOREIGN KEY ("repoOnUserId") REFERENCES "RepoOnUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
