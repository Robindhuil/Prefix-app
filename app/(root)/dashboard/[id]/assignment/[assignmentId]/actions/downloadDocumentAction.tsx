// app/(root)/dashboard/[id]/assignment/[assignmentId]/actions/downloadDocumentAction.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function downloadDocumentAction(documentId: number) {
    const session = await auth();
    if (!session?.user?.id) return null;

    const doc = await prisma.document.findUnique({
        where: { id: documentId },
        select: { data: true, fileName: true, mimeType: true },
    });

    if (!doc?.data) return null;

    return {
        buffer: Buffer.from(doc.data),
        fileName: doc.fileName,
        mimeType: doc.mimeType,
    };
}