// app/(root)/dashboard/[id]/assignment/[assignmentId]/actions/uploadDocumentAction.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { isAdmin } from "@/utils/auth";

export async function uploadDocumentAction(
  file: File,
  assignmentId: number,
  documentType: "INVOICE" | "ORDER" | "CONTRACT" | "OTHER"
) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Neautorizovaný" };

  // Check if user is admin
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    return { success: false, error: "Prístup odmietnutý. Len administrátori môžu nahrávať dokumenty." };
  }

  const adminId = parseInt(session.user.id, 10);
  if (isNaN(adminId)) return { success: false, error: "Neplatné ID" };

  try {
    // First, get the assignment to find the user it belongs to
    const assignment = await prisma.userAssignment.findUnique({
      where: { id: assignmentId },
      select: { userId: true },
    });

    if (!assignment) {
      return { success: false, error: "Priradenie nebolo nájdené" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash("sha256").update(buffer).digest("base64");

    // 1. Uložíme súbor do DB (binárne dáta)
    // userId = user who owns the document (the assignment's user)
    // createdBy = admin who uploaded it
    const doc = await prisma.document.create({
      data: {
        userId: assignment.userId, // ← The user who owns the assignment
        createdBy: adminId, // ← The admin who uploaded it
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        data: buffer, // ← BINÁRNE DÁTA
        documentType,
        hash,
        description: `Nahrané pre assignment #${assignmentId}`,
      },
    });

    // 2. Prepojíme s assignmentom
    await prisma.assignmentDocument.create({
      data: {
        userAssignmentId: assignmentId,
        documentId: doc.id,
      },
    });

    return { success: true, documentId: doc.id };
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return { success: false, error: err.message || "Chyba servera" };
  }
}