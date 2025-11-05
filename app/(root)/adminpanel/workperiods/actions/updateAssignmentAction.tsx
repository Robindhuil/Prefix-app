"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAssignmentAction(data: {
    userId: number;
    workPeriodId: number;
    fromDate: string;
    toDate: string;
    profession: string;
}) {
    try {
        await prisma.userAssignment.updateMany({
            where: {
                userId: data.userId,
                workPeriodId: data.workPeriodId,
            },
            data: {
                fromDate: new Date(data.fromDate),
                toDate: new Date(data.toDate),
                profession: data.profession as any,
            },
        });

        revalidatePath("/adminpanel/workperiods");
        return { success: true };
    } catch (err) {
        console.error("Update assignment failed:", err);
        return { success: false, error: "Nepodarilo sa upraviť priradenie." };
    }
}
