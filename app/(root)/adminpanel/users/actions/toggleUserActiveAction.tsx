"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const toggleSchema = z.object({
    id: z.string().transform(Number),
    isActive: z.string().transform((val) => val === "true"),
});

export async function toggleUserActiveAction(formData: FormData) {
    try {
        const { id, isActive } = toggleSchema.parse(Object.fromEntries(formData.entries()));

        await prisma.user.update({
            where: { id },
            data: { isActive },
        });

        return { success: true };
    } catch (error) {
        console.error("Toggle user active error:", error);
        return { error: "Nepodarilo sa zmeniť stav používateľa" };
    }
}