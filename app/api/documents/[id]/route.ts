// app/api/documents/[id]/route.ts
import { NextResponse } from "next/server";
import { downloadDocumentAction } from "@/app/(root)/dashboard/[id]/assignment/[assignmentId]/actions/downloadDocumentAction";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/utils/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) return new NextResponse("Invalid ID", { status: 400 });

    const result = await downloadDocumentAction(id);
    if (!result) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(result.buffer, {
        headers: {
            "Content-Type": result.mimeType,
            "Content-Disposition": `attachment; filename="${encodeURIComponent(result.fileName)}"`,
            "Cache-Control": "no-cache",
        },
    });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
        return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const admin = await isAdmin();
    if (!admin) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    try {
        // Remove any assignment links first
        await prisma.assignmentDocument.deleteMany({
            where: { documentId: id },
        });
        // Delete the document record
        await prisma.document.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e?.message || "Delete failed" },
            { status: 500 }
        );
    }
}