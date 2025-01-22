/*
  Warnings:

  - Added the required column `updatedAt` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CollaboratorRole" AS ENUM ('VIEWER', 'EDITOR', 'ADMIN');

-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "MapCollaborator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "role" "CollaboratorRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MapCollaborator_userId_mapId_key" ON "MapCollaborator"("userId", "mapId");

-- AddForeignKey
ALTER TABLE "MapCollaborator" ADD CONSTRAINT "MapCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapCollaborator" ADD CONSTRAINT "MapCollaborator_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
