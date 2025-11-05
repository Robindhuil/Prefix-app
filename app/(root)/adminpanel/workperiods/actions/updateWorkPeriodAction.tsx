// app/(root)/adminpanel/workperiods/actions/updateWorkPeriodAction.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function updateWorkPeriodAction(
    id: number,
    data: {
        title: string;
        description?: string | null;
        startDate: string;
        endDate: string;
        requirements?: { profession: "WELDER" | "BRICKLAYER" | "OTHER"; countNeeded: number }[];
    }
) {
    try {
        // Najprv vymaž staré požiadavky
        await prisma.workRequirement.deleteMany({
            where: { workPeriodId: id },
        });

        // Potom vytvor nové
        const updated = await prisma.workPeriod.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description ?? null,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                requirements: {
                    create: data.requirements
                        ?.filter(r => r.countNeeded > 0)
                        .map(r => ({
                            profession: r.profession,
                            countNeeded: r.countNeeded,
                        })) || [],
                },
            },
            select: { id: true },
        });

        revalidatePath("/adminpanel/workperiods");
        return { success: true, id: updated.id };
    } catch (error: any) {
        console.error("UPDATE ERROR:", error);
        return { success: false, error: error.message || "Chyba pri úprave" };
    }
}