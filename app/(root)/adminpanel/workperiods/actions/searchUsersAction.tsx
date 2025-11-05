"use server";

import prisma from "@/lib/prisma";
export async function searchUsersAction(query: string) {
    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { username: { contains: query, mode: "insensitive" } },
                ],
                isActive: true,
            },
            select: { id: true, username: true, name: true },
            take: 10,
        });

        return { success: true, users };
    } catch (error) {
        console.error(error);
        return { success: false, users: [], error: "Chyba pri vyhľadávaní" };
    }
}
