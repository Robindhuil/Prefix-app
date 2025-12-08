import CalendarSection from "@/components/dashboard/calendar/CalendarSection";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function CalendarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  const session = await auth();
  
  if (!session?.user) redirect("/login");
  
  if (session.user.role !== "ADMIN" && Number(session.user.id) !== userId) {
    redirect(`/dashboard/${session.user.id}/calendar`);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      assignments: {
        select: {
          id: true,
          fromDate: true,
          toDate: true,
          workPeriod: {
            select: { 
              id: true, 
              title: true, 
              startDate: true, 
              endDate: true 
            },
          },
        },
      },
    },
  });

  if (!user) redirect("/not-found");

  // Convert Date fields to strings
  const assignments = user.assignments.map(a => ({
    ...a,
    workPeriod: {
      ...a.workPeriod,
      startDate: a.workPeriod.startDate instanceof Date ? a.workPeriod.startDate.toISOString() : String(a.workPeriod.startDate),
      endDate: a.workPeriod.endDate instanceof Date ? a.workPeriod.endDate.toISOString() : String(a.workPeriod.endDate),
    },
    fromDate: a.fromDate instanceof Date ? a.fromDate.toISOString() : String(a.fromDate),
    toDate: a.toDate instanceof Date ? a.toDate.toISOString() : String(a.toDate),
  }));

  return (
    <div className="min-h-screen bg-background py-8">
      <CalendarSection assignments={assignments} userId={userId} />
    </div>
  );
}
