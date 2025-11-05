"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Profession } from "@/app/generated/prisma/client";

type Input = {
    userId: number;
    workPeriodId: number;
    fromDate: string;
    toDate: string;
    profession?: Profession; // 👈 voliteľné, ak sa nepošle => OTHER
};

export async function assignUserToWorkPeriodAction({
    userId,
    workPeriodId,
    fromDate,
    toDate,
    profession = Profession.OTHER, // 👈 default
}: Input) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { success: false, error: "Používateľ neexistuje." };

        const workPeriod = await prisma.workPeriod.findUnique({ where: { id: workPeriodId } });
        if (!workPeriod) return { success: false, error: "Obdobie neexistuje." };

        const assignment = await prisma.userAssignment.create({
            data: {
                userId,
                workPeriodId,
                fromDate: new Date(fromDate),
                toDate: new Date(toDate),
                profession, // ✅ uložíme enum
            },
        });

        revalidatePath("/adminpanel/workperiods");
        return { success: true, assignment };
    } catch (error: any) {
        console.error("assignUserToWorkPeriodAction error:", error);
        return { success: false, error: error.message };
    }
}
