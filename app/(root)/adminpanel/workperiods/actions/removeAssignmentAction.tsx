"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type Input = {
    userId: number;
    workPeriodId: number;
};

export async function removeAssignmentAction({ userId, workPeriodId }: Input) {
    try {
        // Skús nájsť priradenie
        const assignment = await prisma.userAssignment.findFirst({
            where: { userId, workPeriodId },
        });

        if (!assignment) {
            return { success: false, error: "Priradenie neexistuje." };
        }

        // Odstráň priradenie
        await prisma.userAssignment.delete({
            where: { id: assignment.id },
        });

        // Revaliduj cache
        revalidatePath("/adminpanel/workperiods");

        return { success: true };
    } catch (error: any) {
        console.error("removeAssignmentAction error:", error);
        return { success: false, error: error.message };
    }
}
