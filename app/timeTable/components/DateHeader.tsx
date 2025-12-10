import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onWeekChange: (direction: "prev" | "next") => void;
  isAnimating: boolean;
  days: Date[];
  getEventCount: (date: Date) => number;
}

export default function DateHeader({
  currentDate,
  onDateChange,
  onWeekChange,
  isAnimating,
  days,
  getEventCount,
}: DateHeaderProps) {
  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex w-full justify-evenly border-b border-gray-200 shrink-0 bg-white z-10">
      <button
        className="p-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => onWeekChange("prev")}
      >
        <ChevronLeft />
      </button>

      <div
        className={`flex flex-1 justify-evenly transition-opacity duration-150 ${isAnimating ? "opacity-0" : "opacity-100"}`}
      >
        {days.map((day) => {
          const today = isToday(day);
          const isSelected =
            day.getDate() === currentDate.getDate() &&
            day.getMonth() === currentDate.getMonth() &&
            day.getFullYear() === currentDate.getFullYear();
          const count = getEventCount(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateChange(day)}
              className={`
                      flex flex-col items-center justify-center w-full py-2 border-r last:border-r-0 transition-all cursor-pointer relative
                      ${
                        isSelected
                          ? "bg-gray-200 shadow-inner border-b-2 border-gray-500"
                          : today
                            ? "bg-blue-50 font-semibold"
                            : "hover:bg-gray-100"
                      }
                    `}
            >
              <span className="text-sm font-semibold uppercase mb-1">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="text-xs text-nowrap">{day.toDateString()}</span>
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-gray-200 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full mb-1">
                  {count}
                </span>
              )}
              {today && (
                <span className="absolute top-2 left-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="p-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => onWeekChange("next")}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
