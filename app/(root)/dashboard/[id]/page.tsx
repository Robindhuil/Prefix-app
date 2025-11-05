import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default async function DashboardPage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const userId = Number(params.id);
    if (session.user.role !== "ADMIN" && Number(session.user.id) !== userId) {
        redirect("/unauthorized");
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

    return <DashboardContent user={user} />;
}
