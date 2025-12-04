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
  params: { id: string; assignmentId: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = Number(params.id);
  const assignmentId = Number(params.assignmentId);

  if (session.user.role !== "ADMIN" && Number(session.user.id) !== userId) {
    redirect("/unauthorized");
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <DashboardSidebar />

      <div className="max-w-9xl mx-auto px-6 py-6 bg-card rounded-3xl shadow-2xl mt-10">
        <Link
          href={`/dashboard/${userId}`}
          className="inline-flex items-center gap-2 cl-text-decor hover:underline mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Späť na dashboard
        </Link>

        <AssignmentDetail assignment={assignment} user={assignment.user} />
      </div>
    </div>
  );
}