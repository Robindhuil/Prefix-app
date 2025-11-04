// app/(root)/adminpanel/workperiods/actions/getWorkPeriodsAction.ts
"use server";

import prisma from "@/lib/prisma";
export async function getWorkPeriods() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const periods = await prisma.workPeriod.findMany({
        orderBy: { startDate: "asc" },
        select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            description: true,
        },
    });

    return periods
        .map(p => ({
            ...p,
            startDate: p.startDate.toISOString().split("T")[0],
            endDate: p.endDate.toISOString().split("T")[0],
        }))
        .sort((a, b) => {
            const aStart = new Date(a.startDate);
            const bStart = new Date(b.startDate);
            const aEnd = new Date(a.endDate);
            const bEnd = new Date(b.endDate);

            const aActive = aStart <= now && now <= aEnd;
            const bActive = bStart <= now && now <= bEnd;

            if (aActive && !bActive) return -1;
            if (!aActive && bActive) return 1;

            if (aActive && bActive) return 0;

            if (aStart > now && bStart > now) {
                return aStart.getTime() - bStart.getTime(); // najbližšie hore
            }

            return bStart.getTime() - aStart.getTime(); // minulé dole
        });
}