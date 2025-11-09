/*
  Warnings:

  - You are about to drop the column `gcsPath` on the `Document` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Document_gcsPath_idx";

-- DropIndex
DROP INDEX "public"."Document_gcsPath_key";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "gcsPath",
ADD COLUMN     "data" BYTEA;
