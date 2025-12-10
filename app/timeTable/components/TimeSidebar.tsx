interface TimeSidebarProps {
  timeSlots: string[];
  slotHeight: number;
  topRowOffsetMargin: number;
}

export default function TimeSidebar({
  timeSlots,
  slotHeight,
  topRowOffsetMargin,
}: TimeSidebarProps) {
  return (
    <div className="sticky left-0 z-30 bg-white border-r border-gray-300 shadow-sm">
      <div
        style={{ marginBottom: topRowOffsetMargin }}
        className="h-10 border-b border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-xs text-gray-500 z-50 sticky top-0"
      >
        TIME
      </div>

      {timeSlots.map((time, index) => (
        <div
          key={time}
          className={`${index === 0 ? "border-t" : ""} flex items-start justify-center border-b border-gray-100 text-xs text-gray-500 px-2 w-32`}
          style={{ height: `${slotHeight}px` }}
        >
          <span className="-mt-2 bg-white px-1">{time}</span>
        </div>
      ))}
    </div>
  );
}
