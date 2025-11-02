-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('INVOICE', 'ORDER', 'CONTRACT', 'OTHER');

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "gcsPath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER,
    "iv" TEXT,
    "tag" TEXT,
    "keyVersion" INTEGER,
    "hash" TEXT,
    "documentType" "DocumentType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_gcsPath_key" ON "Document"("gcsPath");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "Document_documentType_idx" ON "Document"("documentType");

-- CreateIndex
CREATE INDEX "Document_createdAt_idx" ON "Document"("createdAt");

-- CreateIndex
CREATE INDEX "Document_gcsPath_idx" ON "Document"("gcsPath");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
