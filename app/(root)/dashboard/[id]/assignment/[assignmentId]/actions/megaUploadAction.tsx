// app/(root)/dashboard/[id]/assignment/[assignmentId]/actions/megaUploadAction.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Storage } from "megajs";

const MEGA_EMAIL = process.env.MEGA_EMAIL!;
const MEGA_PASSWORD = process.env.MEGA_PASSWORD!;

export async function megaUploadAction(
    file: File,
    assignmentId: number,
    documentType: "INVOICE" | "ORDER" | "CONTRACT" | "OTHER"
) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Neautorizovaný" };

    const userId = parseInt(session.user.id, 10);
    if (isNaN(userId)) return { success: false, error: "Neplatné ID" };

    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const storage = await new Storage({
            email: MEGA_EMAIL,
            password: MEGA_PASSWORD,
        }).ready;

        const uploadedFile = await storage.upload({
            name: `${assignmentId}_${userId}_${file.name}`,
            size: file.size,
        }, buffer).complete;

        const link: string = await uploadedFile.link({});

        // 1. Vytvor dokument
        const doc = await prisma.document.create({
            data: {
                userId,
                createdBy: userId,
                fileName: file.name,
                gcsPath: link,
                mimeType: file.type || "application/octet-stream",
                size: file.size,
                documentType,
                description: `Nahrané pre assignment #${assignmentId}`,
            },
        });

        // 2. Prepoj s assignmentom
        await prisma.assignmentDocument.create({
            data: {
                userAssignmentId: assignmentId,
                documentId: doc.id,
            },
        });

        return { success: true, url: link, documentId: doc.id };
    } catch (err: any) {
        console.error("MEGA UPLOAD ERROR:", err);
        return { success: false, error: err.message || "Chyba servera" };
    }
}