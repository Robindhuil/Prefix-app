// app/dashboard/[id]/assignment/[assignmentId]/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AssignmentDetail from "@/components/dashboard/assignment/AssignmentDetail";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id, assignmentId: assignmentIdStr } = await params;
  const userId = Number(id);
  const assignmentId = Number(assignmentIdStr);

  if (session.user.role !== "ADMIN" && Number(session.user.id) !== userId) {
    redirect(`/dashboard/${session.user.id}`); // <- redirect to own dashboard
  }

  const assignment = await prisma.userAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      user: true,
      workPeriod: true,
      documents: {
        include: {
          document: {
            select: {
              id: true,
              fileName: true,
              mimeType: true,
              size: true,
              documentType: true,
              createdAt: true,
              hash: true,
            },
          },
        },
      },
    },
  });

  if (!assignment || assignment.userId !== userId) redirect("/not-found");

  // Convert Date fields to string for AssignmentDetail props
  const assignmentForDetail = {
    ...assignment,
    workPeriod: {
      ...assignment.workPeriod,
      startDate: assignment.workPeriod.startDate.toISOString(),
      endDate: assignment.workPeriod.endDate.toISOString(),
      description: assignment.workPeriod.description ?? undefined, // convert null -> undefined
      title: assignment.workPeriod.title,
    },
    fromDate: assignment.fromDate.toISOString(),
    toDate: assignment.toDate.toISOString(),
    documents: assignment.documents.map((doc) => ({
      ...doc,
      document: {
        ...doc.document,
        size: doc.document.size ?? 0,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <DashboardSidebar />

      <div className="flex-1 w-full px-6 py-6 bg-card rounded-3xl shadow-2xl m-10">
        <Link
          href={`/dashboard/${userId}`}
          className="inline-flex items-center gap-2 cl-text-decor hover:underline mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Späť na dashboard
        </Link>

        <AssignmentDetail
          assignment={assignmentForDetail}
          user={assignment.user}
          isUserAdmin={session.user.role === "ADMIN"} // <- pass admin flag
        />
      </div>
    </div>
  );
}