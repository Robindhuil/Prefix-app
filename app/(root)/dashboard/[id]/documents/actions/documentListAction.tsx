"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getDocumentsForUser(userId: number) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    // Check if user can access this data
    if (session.user.role !== "ADMIN" && Number(session.user.id) !== userId) {
        throw new Error("Forbidden");
    }

    const documents = await prisma.document.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            fileName: true,
            size: true,
            documentType: true,
            description: true,
            createdAt: true,
            assignmentLinks: {
                select: {
                    userAssignmentId: true,
                    userAssignment: {
                        select: {
                            id: true,
                            workPeriod: {
                                select: {
                                    title: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // Convert Date fields to strings for client
    return documents.map(doc => ({
        ...doc,
        size: doc.size ?? 0,
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
        assignmentLinks: doc.assignmentLinks.map(link => ({
            ...link,
        })),
    }));
}
