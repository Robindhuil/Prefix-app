"use client";

import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import WorkPeriodCards from "./WorkPeriodCards";

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  workPeriodStatus?: "active" | "upcoming" | "ended";
  assignments: Assignment[];
};

type Assignment = {
  id: number;
  fromDate: string;
  toDate: string;
  workPeriod: {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
  };
};

type CalendarSectionProps = {
  assignments?: Assignment[];
  userId: number;
};

export default function CalendarSection({ assignments = [], userId }: CalendarSectionProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  const monthNames = [
    "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
    "Júl", "August", "September", "Október", "November", "December"
  ];

  const dayNames = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

  // Helper to get all assignments for a specific date
  const getAssignmentsForDate = (date: Date): Assignment[] => {
    const matchingAssignments: Assignment[] = [];

    for (const assignment of assignments) {
      const fromDate = new Date(assignment.fromDate);
      const toDate = new Date(assignment.toDate);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      // Check if date is within assignment period
      if (date >= fromDate && date <= toDate) {
        matchingAssignments.push(assignment);
      }
    }

    return matchingAssignments;
  };

  // Helper to get work period status for a date (primary status)
  const getWorkPeriodStatusForDate = (date: Date): "active" | "upcoming" | "ended" | undefined => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateAssignments = getAssignmentsForDate(date);
    if (dateAssignments.length === 0) return undefined;

    // Prioritize active status
    for (const assignment of dateAssignments) {
      const workStart = new Date(assignment.workPeriod.startDate);
      const workEnd = new Date(assignment.workPeriod.endDate);
      workStart.setHours(0, 0, 0, 0);
      workEnd.setHours(0, 0, 0, 0);

      if (today >= workStart && today <= workEnd) return "active";
    }

    // Then upcoming
    for (const assignment of dateAssignments) {
      const workStart = new Date(assignment.workPeriod.startDate);
      workStart.setHours(0, 0, 0, 0);
      if (today < workStart) return "upcoming";
    }

    // Otherwise ended
    return "ended";
  };

  // Get calendar days for the current month
  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday = 0
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek === -1) firstDayOfWeek = 6;

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        workPeriodStatus: getWorkPeriodStatusForDate(date),
        assignments: getAssignmentsForDate(date),
      });
    }

    // Add days from current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        workPeriodStatus: getWorkPeriodStatusForDate(date),
        assignments: getAssignmentsForDate(date),
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        workPeriodStatus: getWorkPeriodStatusForDate(date),
        assignments: getAssignmentsForDate(date),
      });
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMouseEnter = (day: CalendarDay, event: React.MouseEvent) => {
    if (day.assignments.length > 0) {
      setHoveredDay(day);
      setHoveredElement(event.currentTarget as HTMLElement);
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
    setHoveredElement(null);
  };

  const calendarDays = getCalendarDays();

  // Get assignments within current month
  const getAssignmentsInCurrentMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    monthStart.setHours(0, 0, 0, 0);
    monthEnd.setHours(23, 59, 59, 999);

    return assignments.filter(assignment => {
      const fromDate = new Date(assignment.fromDate);
      const toDate = new Date(assignment.toDate);
      
      // Check if assignment overlaps with current month
      return (fromDate <= monthEnd && toDate >= monthStart);
    });
  };

  const monthAssignments = getAssignmentsInCurrentMonth();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-card backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
        <CalendarHeader
          year={currentDate.getFullYear()}
          monthName={monthNames[currentDate.getMonth()]}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />

        <CalendarGrid
          calendarDays={calendarDays}
          dayNames={dayNames}
          hoveredDay={hoveredDay}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />

        <WorkPeriodCards
          assignments={monthAssignments}
          userId={userId}
          monthName={monthNames[currentDate.getMonth()]}
        />
      </div>
    </div>
  );
}
