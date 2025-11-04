// app/(root)/adminpanel/workperiods/actions/getWorkPeriodDetailAction.ts
"use server";

import prisma from "@/lib/prisma";

export async function getWorkPeriodDetail(id: number) {
    const period = await prisma.workPeriod.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            requirements: {
                select: { profession: true, countNeeded: true },
            },
            assignments: {
                select: {
                    user: { select: { id: true, username: true, name: true } },
                    fromDate: true,
                    toDate: true,
                },
            },
        },
    });

    if (!period) return null;

    return {
        ...period,
        startDate: period.startDate.toISOString().split("T")[0],
        endDate: period.endDate.toISOString().split("T")[0],
        createdAt: period.createdAt.toISOString().split("T")[0],
        assignments: period.assignments.map(a => ({
            ...a,
            fromDate: a.fromDate.toISOString().split("T")[0],
            toDate: a.toDate.toISOString().split("T")[0],
        })),
    };
}