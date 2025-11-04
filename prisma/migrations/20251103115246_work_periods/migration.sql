-- CreateEnum
CREATE TYPE "Profession" AS ENUM ('WELDER', 'BRICKLAYER', 'OTHER');

-- CreateTable
CREATE TABLE "WorkPeriod" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkRequirement" (
    "id" SERIAL NOT NULL,
    "profession" "Profession" NOT NULL,
    "countNeeded" INTEGER NOT NULL,
    "workPeriodId" INTEGER NOT NULL,

    CONSTRAINT "WorkRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssignment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "workPeriodId" INTEGER NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentDocument" (
    "id" SERIAL NOT NULL,
    "userAssignmentId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserAssignment_userId_idx" ON "UserAssignment"("userId");

-- CreateIndex
CREATE INDEX "UserAssignment_workPeriodId_idx" ON "UserAssignment"("workPeriodId");

-- AddForeignKey
ALTER TABLE "WorkRequirement" ADD CONSTRAINT "WorkRequirement_workPeriodId_fkey" FOREIGN KEY ("workPeriodId") REFERENCES "WorkPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_workPeriodId_fkey" FOREIGN KEY ("workPeriodId") REFERENCES "WorkPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentDocument" ADD CONSTRAINT "AssignmentDocument_userAssignmentId_fkey" FOREIGN KEY ("userAssignmentId") REFERENCES "UserAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentDocument" ADD CONSTRAINT "AssignmentDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
