/*
  Warnings:

  - Made the column `updatedAt` on table `Document` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Document_createdBy_idx" ON "Document"("createdBy");
