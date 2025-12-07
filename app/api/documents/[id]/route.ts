// app/api/documents/[id]/route.ts
import { NextResponse } from "next/server";
import { downloadDocumentAction } from "@/app/(root)/dashboard/[id]/assignment/[assignmentId]/actions/downloadDocumentAction";

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