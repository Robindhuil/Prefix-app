"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const deleteUserSchema = z.object({
    id: z.string().transform(Number),
});

export async function deleteUserAction(formData: FormData) {
    try {
        const { id } = deleteUserSchema.parse(Object.fromEntries(formData.entries()));

        // Prevent deleting self (optional – you can adjust logic)
        // If you want to allow self-delete, remove this check
        // const session = await getServerSession(authOptions);
        // if (session?.user?.id === id) {
        //   return { error: "Nemôžete odstrániť vlastný účet" };
        // }

        await prisma.user.delete({
            where: { id },
        });

        return { success: true };
    } catch (error) {
        return { error: "Nepodarilo sa odstrániť používateľa" };
    }
}