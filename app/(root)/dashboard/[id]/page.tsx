// app/dashboard/[id]/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";
import PasswordForm from "@/components/dashboard/PasswordForm";
import AssignmentsList from "@/components/dashboard/AssignmentsList";

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

    return (
        <div className="space-y-10 py-8">
            {/* 1. HEADER */}
            <ProfileHeader user={user} />

            {/* 2. DVE KARTY VEĽKOSŤOU 50/50 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ProfileForm user={user} />
                <PasswordForm />
            </div>

            {/* 3. PRIRADENIA – CELÁ ŠÍRKA */}
            <AssignmentsList assignments={user.assignments} />
        </div>
    );
}