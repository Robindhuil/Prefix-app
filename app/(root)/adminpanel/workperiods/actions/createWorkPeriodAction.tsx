// app/(root)/adminpanel/workperiods/actions/createWorkPeriodAction.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createWorkPeriodAction(data: {
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  requirements?: { profession: "WELDER" | "BRICKLAYER" | "OTHER"; countNeeded: number }[];
}) {
  try {
    const period = await prisma.workPeriod.create({
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
    return { success: true, id: period.id };
  } catch (error: any) {
    console.error("CREATE ERROR:", error);
    return { success: false, error: error.message || "Chyba pri vytváraní" };
  }
}