// app/dashboard/[id]/actions/updateProfileAction.ts
"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(userId: number, data: { name: string; email: string }) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && Number(session.user.id) !== userId)) {
        return { error: "Nemáš oprávnenie" };
    }

    await prisma.user.update({
        where: { id: userId },
        data: { name: data.name || null, email: data.email || null },
    });

    revalidatePath(`/dashboard/${userId}`);
}