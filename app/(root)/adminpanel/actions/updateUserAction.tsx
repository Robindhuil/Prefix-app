"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const updateUserSchema = z.object({
    id: z.string().transform(Number),
    username: z.string().min(3).max(50),
    email: z.string().email().max(100).nullable().optional(),
    name: z.string().max(100).nullable().optional(),
    password: z.string().min(6).max(100).optional(),
    role: z.enum(["USER", "ADMIN"]),
});

export async function updateUserAction(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const parsed = updateUserSchema.parse({
            ...data,
            email: data.email === "" ? null : data.email,
            name: data.name === "" ? null : data.name,
            password: data.password === "" ? undefined : data.password,
        });

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: parsed.username },
                    parsed.email ? { email: parsed.email } : {},
                ].filter(Boolean),
                NOT: { id: parsed.id },
            },
        });

        if (existingUser) {
            return { error: "Používateľské meno alebo email už používa iný používateľ" };
        }

        const updateData: any = {
            username: parsed.username,
            email: parsed.email,
            name: parsed.name,
            role: parsed.role,
        };

        if (parsed.password) {
            updateData.hashedpassword = await hash(parsed.password, 12);
        }

        await prisma.user.update({
            where: { id: parsed.id },
            data: updateData,
        });

        return { success: true };
    } catch (error) {
        return { error: "Nepodarilo sa upraviť používateľa" };
    }
}