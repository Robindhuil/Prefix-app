// app/dashboard/[id]/actions/changePasswordAction.ts
"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function changePasswordAction(oldPassword: string, newPassword: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Nie si prihlásený" };

    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) },
        select: { hashedpassword: true },
    });

    if (!user) return { error: "Používateľ nenájdený" };

    const match = await bcrypt.compare(oldPassword, user.hashedpassword);
    if (!match) return { error: "Staré heslo je nesprávne" };

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: Number(session.user.id) },
        data: { hashedpassword: hashed },
    });

    return { success: true };
}