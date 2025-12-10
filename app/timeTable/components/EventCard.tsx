import { useMemo } from "react";
import { X } from "lucide-react";
import type { IEvent } from "../../../types/Event";

interface EventCardProps {
  event: IEvent;
  style: React.CSSProperties;
  onDelete: () => void;
}

const EVENT_COLORS = [
  "bg-blue-100 border-blue-300 hover:bg-blue-200",
  "bg-green-100 border-green-300 hover:bg-green-200",
  "bg-purple-100 border-purple-300 hover:bg-purple-200",
  "bg-orange-100 border-orange-300 hover:bg-orange-200",
  "bg-pink-100 border-pink-300 hover:bg-pink-200",
];

export default function EventCard({ event, style, onDelete }: EventCardProps) {
  // Random color selection (memoized to be stable for the component lifecycle)
  const colorIndex = useMemo(
    () => Math.floor(Math.random() * EVENT_COLORS.length),
    []
  );
  const colorClass = EVENT_COLORS[colorIndex];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${event.name}"?`)) {
      onDelete();
    }
  };

  return (
    <div
      className={`absolute flex flex-col justify-center items-center border p-1 text-xs overflow-hidden transition-colors cursor-pointer shadow-sm z-10 group ${colorClass}`}
      style={style}
      title={`${event.name}\n${event.description}`}
    >
      {/* Delete Button - appears on hover */}
      <button
        onClick={handleDelete}
        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        title="Delete event"
      >
        <X size={12} />
      </button>

      <div className="font-semibold truncate text-gray-900">{event.name}</div>
      {event.description && (
        <div className="text-gray-600 text-xs truncate max-w-full opacity-80">
          {event.description}
        </div>
      )}
      <div className="text-gray-700 text-xs">
        {event.startTime} - {event.endTime}
      </div>
    </div>
  );
}
