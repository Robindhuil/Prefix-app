import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
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
        },
    });

    if (!user) redirect("/not-found");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
            {/* Sidebar je klientová komponenta */}
            <DashboardSidebar />
            <main className="flex-1 pt-16 md:pt-0 pb-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
