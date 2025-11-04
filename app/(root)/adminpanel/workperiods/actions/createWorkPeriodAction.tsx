// app/(root)/admin/actions/createWorkPeriodAction.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWorkPeriodAction(data: {
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  requirements: { profession: string; count: number }[];
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Nemáš oprávnenie" };
  }

  try {
    const period = await prisma.workPeriod.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        requirements: {
          create: data.requirements.map((r) => ({
            profession: r.profession as any,
            countNeeded: r.count,
          })),
        },
      },
      select: { id: true }, // ← vraciame ID
    });

    revalidatePath("/admin");
    revalidatePath("/admin/workperiods");

    return { success: true, id: period.id };
  } catch (err: any) {
    console.error("CREATE WORKPERIOD ERROR:", err);
    return { success: false, error: err.message || "Chyba servera" };
  }
}