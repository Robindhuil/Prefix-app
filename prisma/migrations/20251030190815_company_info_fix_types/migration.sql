/*
  Warnings:

  - Changed the type of `foundingDate` on the `CompanyInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `functionStartDate` on the `CompanyInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CompanyInfo" DROP COLUMN "foundingDate",
ADD COLUMN     "foundingDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "functionStartDate",
ADD COLUMN     "functionStartDate" TIMESTAMP(3) NOT NULL;
