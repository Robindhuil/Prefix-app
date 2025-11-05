-- DropForeignKey
ALTER TABLE "public"."WorkRequirement" DROP CONSTRAINT "WorkRequirement_workPeriodId_fkey";

-- AddForeignKey
ALTER TABLE "WorkRequirement" ADD CONSTRAINT "WorkRequirement_workPeriodId_fkey" FOREIGN KEY ("workPeriodId") REFERENCES "WorkPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
