"use server";

import prisma from "@/lib/prisma";

export async function getAssignmentDetailsAction(userId: number, workPeriodId: number) {
    try {
        const assignment = await prisma.userAssignment.findFirst({
            where: {
                userId,
                workPeriodId,
            },
            select: {
                id: true,
                profession: true,
                fromDate: true,
                toDate: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
                workPeriod: {
                    select: {
                        title: true,
                        startDate: true,
                        endDate: true,
                        description: true,
                    },
                },
                documents: {
                    select: {
                        id: true,
                        document: {
                            select: {
                                id: true,
                                fileName: true,
                                mimeType: true,
                                size: true,
                                documentType: true,
                                createdAt: true,
                                hash: true,
                            },
                        },
                    },
                },
            },
        });

        if (!assignment) {
            return {
                success: false,
                error: "Priradenie nebolo nájdené",
            };
        }

        return {
            success: true,
            assignment: {
                id: assignment.id,
                workPeriod: {
                    title: assignment.workPeriod.title,
                    startDate: assignment.workPeriod.startDate.toISOString().split("T")[0],
                    endDate: assignment.workPeriod.endDate.toISOString().split("T")[0],
                    description: assignment.workPeriod.description || undefined,
                },
                profession: assignment.profession,
                fromDate: assignment.fromDate.toISOString().split("T")[0],
                toDate: assignment.toDate.toISOString().split("T")[0],
                user: assignment.user,
                documents: assignment.documents.map((ad) => ({
                    id: ad.id,
                    document: {
                        id: ad.document.id,
                        fileName: ad.document.fileName,
                        mimeType: ad.document.mimeType,
                        size: ad.document.size,
                        documentType: ad.document.documentType,
                        createdAt: ad.document.createdAt?.toISOString().split("T")[0],
                        hash: ad.document.hash,
                    },
                })),
            },
        };
    } catch (error) {
        console.error("Error fetching assignment details:", error);
        return {
            success: false,
            error: "Chyba pri načítaní dát",
        };
    }
}
