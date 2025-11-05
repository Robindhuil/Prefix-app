// app/(root)/adminpanel/workperiods/actions/deleteWorkPeriodAction.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteWorkPeriodAction(id: number) {
    try {
        await prisma.workPeriod.delete({
            where: { id },
        });

        revalidatePath("/adminpanel/workperiods");
        return { success: true };
    } catch (error) {
        console.error("Delete failed:", error);
        return { success: false, error: "Nepodarilo sa odstrániť obdobie" };
    }
}