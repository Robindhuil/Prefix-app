import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarHeaderProps = {
  year: number;
  monthName: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

export default function CalendarHeader({
  year,
  monthName,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* Year on the left */}
      <div className="text-3xl font-bold cl-text-decor">{year}</div>

      {/* Month with navigation arrows in center */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPreviousMonth}
          className="p-2 cursor-pointer rounded-full bg-neutral hover:bg-neutral transition-all duration-300 group"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-6 h-6 text-color group-hover:cl-text-decor transition-colors" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-color min-w-[180px] text-center">
          {monthName}
        </h2>

        <button
          onClick={onNextMonth}
          className="p-2  cursor-pointer rounded-full bg-neutral hover:bg-neutral transition-all duration-300 group"
          aria-label="Next month"
        >
          <ChevronRight className="w-6 h-6 text-color group-hover:cl-text-decor transition-colors" />
        </button>
      </div>

      {/* Empty space for balance */}
      <div className="w-24"></div>
    </div>
  );
}
