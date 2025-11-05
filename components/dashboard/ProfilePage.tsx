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
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            <ProfileHeader user={user} />

            <div className="grid md:grid-cols-2 gap-8">
                <ProfileForm user={user} />
                <PasswordForm />
            </div>

            <AssignmentsList assignments={user.assignments} />
        </div>
    );
}