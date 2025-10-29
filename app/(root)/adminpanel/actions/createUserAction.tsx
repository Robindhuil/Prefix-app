"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const createUserSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email().max(100).nullable().optional(),
    name: z.string().max(100).nullable().optional(),
    password: z.string().min(6).max(100),
    role: z.enum(["USER", "ADMIN"]),
});

export async function createUserAction(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        // Convert empty strings to null for email and name
        const parsed = createUserSchema.parse({
            ...data,
            email: data.email === "" ? null : data.email,
            name: data.name === "" ? null : data.name,
        });

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: parsed.username },
                    parsed.email ? { email: parsed.email } : {},
                ].filter(Boolean),
            },
        });

        if (existingUser) {
            return { error: "Používateľské meno alebo email už existuje" };
        }

        const hashedPassword = await hash(parsed.password, 12);

        await prisma.user.create({
            data: {
                username: parsed.username,
                email: parsed.email,
                name: parsed.name,
                hashedpassword: hashedPassword,
                role: parsed.role,
            },
        });

        return { success: true };
    } catch (error) {
        return { error: "Nepodarilo sa vytvoriť používateľa" };
    }
}