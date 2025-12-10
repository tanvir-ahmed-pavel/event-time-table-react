import { useMemo } from "react";
import type { IEvent } from "../../../types/Event";

interface EventCardProps {
  event: IEvent;
  style: React.CSSProperties;
}

const EVENT_COLORS = [
  "bg-blue-100 border-blue-300 hover:bg-blue-200",
  "bg-green-100 border-green-300 hover:bg-green-200",
  "bg-purple-100 border-purple-300 hover:bg-purple-200",
  "bg-orange-100 border-orange-300 hover:bg-orange-200",
  "bg-pink-100 border-pink-300 hover:bg-pink-200",
];

export default function EventCard({ event, style }: EventCardProps) {
  // Random color selection (memoized to be stable for the component lifecycle)
  const colorIndex = useMemo(
    () => Math.floor(Math.random() * EVENT_COLORS.length),
    []
  );
  const colorClass = EVENT_COLORS[colorIndex];

  return (
    <div
      className={`absolute flex flex-col justify-center items-center border p-1 text-xs overflow-hidden transition-colors cursor-pointer shadow-sm z-10 ${colorClass}`}
      style={style}
      title={`${event.name}\n${event.description}`}
    >
      <div className="font-semibold truncate text-gray-900">{event.name}</div>
      <div className="text-gray-700 text-xs">
        {new Date(event.startDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {new Date(event.endDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
