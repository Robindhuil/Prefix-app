-- CreateTable
CREATE TABLE "WorkHours" (
    "id" SERIAL NOT NULL,
    "userAssignmentId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkHours_userAssignmentId_idx" ON "WorkHours"("userAssignmentId");

-- CreateIndex
CREATE INDEX "WorkHours_date_idx" ON "WorkHours"("date");

-- CreateIndex
CREATE UNIQUE INDEX "WorkHours_userAssignmentId_date_key" ON "WorkHours"("userAssignmentId", "date");

-- AddForeignKey
ALTER TABLE "WorkHours" ADD CONSTRAINT "WorkHours_userAssignmentId_fkey" FOREIGN KEY ("userAssignmentId") REFERENCES "UserAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
