"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getWorkingHoursAction(assignmentId: number) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user has access to this assignment
    const assignment = await prisma.userAssignment.findUnique({
      where: { id: assignmentId },
      include: { user: true },
    });

    if (!assignment) {
      return { success: false, error: "Assignment not found" };
    }

    // Check if user is either the owner or an admin
    const isOwner = assignment.userId === Number(session.user.id);
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        error: "You don't have permission to view this assignment",
      };
    }

    // Get all work hours for this assignment
    const workHours = await prisma.workHours.findMany({
      where: { userAssignmentId: assignmentId },
      orderBy: { date: "asc" },
    });

    return {
      success: true,
      data: workHours.map((wh) => ({
        id: wh.id,
        date: wh.date.toISOString(),
        hoursWorked: wh.hoursWorked,
        note: wh.note,
        editable: wh.editable,
      })),
    };
  } catch (error) {
    console.error("Error fetching work hours:", error);
    return { success: false, error: "Internal server error" };
  }
}
