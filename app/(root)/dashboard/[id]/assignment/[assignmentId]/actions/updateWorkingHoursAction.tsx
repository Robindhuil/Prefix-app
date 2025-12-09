"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

type UpdateWorkHoursInput = {
  userAssignmentId: number;
  date: string;
  hoursWorked: number;
  note?: string | null;
};

export async function updateWorkingHoursAction(input: UpdateWorkHoursInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const { userAssignmentId, date, hoursWorked, note } = input;

    // Validate input
    if (!userAssignmentId || !date || hoursWorked === undefined) {
      return { success: false, error: "Missing required fields" };
    }

    // Check if user has access to this assignment
    const assignment = await prisma.userAssignment.findUnique({
      where: { id: userAssignmentId },
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
        error: "You don't have permission to edit this assignment",
      };
    }

    // Validate date is within assignment period
    const assignmentDate = new Date(date);
    const fromDate = new Date(assignment.fromDate);
    const toDate = new Date(assignment.toDate);

    if (assignmentDate < fromDate || assignmentDate > toDate) {
      return { success: false, error: "Date is outside assignment period" };
    }

    // Check if the existing entry is editable
    const existingEntry = await prisma.workHours.findUnique({
      where: {
        userAssignmentId_date: {
          userAssignmentId,
          date: new Date(date),
        },
      },
    });

    if (existingEntry && !existingEntry.editable) {
      return { success: false, error: "This entry is locked and cannot be edited" };
    }

    // Upsert work hours (create or update)
    const workHours = await prisma.workHours.upsert({
      where: {
        userAssignmentId_date: {
          userAssignmentId,
          date: new Date(date),
        },
      },
      update: {
        hoursWorked: Number(hoursWorked),
        note: note || null,
      },
      create: {
        userAssignmentId,
        date: new Date(date),
        hoursWorked: Number(hoursWorked),
        note: note || null,
      },
    });

    return {
      success: true,
      data: {
        id: workHours.id,
        date: workHours.date.toISOString(),
        hoursWorked: workHours.hoursWorked,
        note: workHours.note,
        editable: workHours.editable,
      },
    };
  } catch (error) {
    console.error("Error saving work hours:", error);
    return { success: false, error: "Internal server error" };
  }
}
