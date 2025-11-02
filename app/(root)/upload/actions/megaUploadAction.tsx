// app/(root)/upload/actions/megaUploadAction.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Storage } from "megajs";

const MEGA_EMAIL = process.env.MEGA_EMAIL!;
const MEGA_PASSWORD = process.env.MEGA_PASSWORD!;

export async function megaUploadAction(file: File) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Neautorizovaný" };

    const userId = parseInt(session.user.id, 10);
    if (isNaN(userId)) return { success: false, error: "Neplatné ID" };

    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        // Prihlásenie
        const storage = await new Storage({
            email: MEGA_EMAIL,
            password: MEGA_PASSWORD,
        }).ready;

        // Nahraj súbor
        const uploadStream = storage.upload({
            name: `${userId}_${file.name}`,
            size: file.size,
        }, buffer);

        // Počkaj na dokončenie
        const uploadedFile = await uploadStream.complete;

        // Získaj link – volaj funkciu s prázdnym objektom
        const link: string = await uploadedFile.link({}); // ← OPRavené! (s {})

        // Ulož do DB
        const doc = await prisma.document.create({
            data: {
                userId,
                createdBy: userId,
                fileName: file.name,
                gcsPath: link,
                mimeType: file.type || "application/octet-stream",
                size: file.size,
                documentType: "OTHER",
                description: `Nahrané do MEGA: ${new Date().toLocaleString()}`,
            },
        });

        return { success: true, url: link, documentId: doc.id };
    } catch (err: any) {
        console.error("MEGA UPLOAD ERROR:", err);
        return { success: false, error: err.message || "Chyba pri nahrávaní do MEGA" };
    }
}