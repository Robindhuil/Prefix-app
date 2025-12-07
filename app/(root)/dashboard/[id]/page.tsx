import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardContent from "@/components/dashboard/DashboardContent";

// app/dashboard/[id]/page.tsx
export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = Number(id);
    const session = await auth();
    if (!session?.user) redirect("/login");

    if (session.user.role !== "ADMIN" && Number(session.user.id) !== userId) {
        redirect(`/dashboard/${session.user.id}`); // <- redirect to own dashboard
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            assignments: {
                include: {
                    workPeriod: {
                        select: { id: true, title: true, startDate: true, endDate: true },
                    },
                },
            },
        },
    });

    if (!user) redirect("/not-found");

    // Convert Date fields in assignments -> strings for DashboardContent
    const userForClient = {
        ...user,
        assignments: user.assignments.map(a => ({
            ...a,
            workPeriod: {
                ...a.workPeriod,
                startDate: a.workPeriod.startDate instanceof Date ? a.workPeriod.startDate.toISOString() : String(a.workPeriod.startDate),
                endDate: a.workPeriod.endDate instanceof Date ? a.workPeriod.endDate.toISOString() : String(a.workPeriod.endDate),
            },
            fromDate: a.fromDate instanceof Date ? a.fromDate.toISOString() : String(a.fromDate),
            toDate: a.toDate instanceof Date ? a.toDate.toISOString() : String(a.toDate),
        })),
    };

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = Number(session.user.id) === userId;

    return <DashboardContent user={userForClient} canEditSensitive={isAdmin || isOwner} />;
}
