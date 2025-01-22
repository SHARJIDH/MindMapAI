/*
  Warnings:

  - You are about to drop the column `name` on the `Map` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Map" DROP COLUMN "name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Map_email_idx" ON "Map"("email");
