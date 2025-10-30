"use server";

import prisma from "@/lib/prisma";
import type { UserModel } from "@/components/adminpanel/users/UsersSection";

type SuccessResponse = {
    success: true;
    data: UserModel[];
};

type ErrorResponse = {
    success: false;
    error: string;
};

export async function getUsersAction(): Promise<SuccessResponse | ErrorResponse> {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const formattedUsers: UserModel[] = users.map((user) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        }));

        return { success: true, data: formattedUsers };
    } catch (error) {
        return { success: false, error: "Nepodarilo sa načítať používateľov" };
    }
}