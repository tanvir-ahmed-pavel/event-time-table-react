import { useRef, useEffect, useState } from "react";
import type { IEvent, IVenue } from "../../../types/Event";
import TimeSidebar from "./TimeSidebar";
import EventCard from "./EventCard";

interface TimetableGridProps {
  venues: IVenue[];
  events: IEvent[];
  timeSlots: string[];
  slotHeight: number;
  headerHeight: number;
  onDeleteEvent: (eventId: string) => void;
}

export default function TimetableGrid({
  venues,
  events,
  timeSlots,
  slotHeight,
  headerHeight,
  onDeleteEvent,
}: TimetableGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollRef.current) {
      const h = now.getHours();
      const m = now.getMinutes();
      const slotIndex = h * 4 + Math.floor(m / 15);

      const offset = slotIndex * slotHeight;
    }
  }, []);

  // Initial scroll effect separate from the time update
  useEffect(() => {
    if (scrollRef.current) {
      const h = new Date().getHours();
      const m = new Date().getMinutes();
      const slotIndex = h * 4 + Math.floor(m / 15);
      const offset = slotIndex * slotHeight;
      scrollRef.current.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, [slotHeight]);

  const getEventStyle = (event: IEvent) => {
    // Parse HH:MM format
    const [startHour, startMin] = event.startTime.split(":").map(Number);
    const [endHour, endMin] = event.endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;

    const top = (startMinutes / 15) * slotHeight + headerHeight;
    const height = (durationMinutes / 15) * slotHeight;

    return {
      top: `${top}px`,
      height: `${height}px`,
      position: "absolute" as const,
    };
  };

  // Calculate Current Time Line Position
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
  const currentTimeTop = (currentTimeMinutes / 15) * slotHeight + headerHeight;

  return (
    <div className="flex flex-1 h-full overflow-hidden relative">
      <div className="flex w-full h-full">
        <div
          ref={scrollRef}
          className="flex-1 overflow-auto w-full h-full relative"
        >
          {/* Time  */}
          <div className="flex min-w-full relative">
            <TimeSidebar timeSlots={timeSlots} slotHeight={slotHeight} />

            {/* CONTENT AREA: Venues + Grid */}
            <div
              className="grid relative flex-1 w-full"
              style={{
                gridTemplateColumns: `repeat(${venues.length}, minmax(400px, 1fr))`,
              }}
            >
              {/* Current Time Indicator Line */}
              <div
                className="absolute border-t-2 border-red-500 z-20 pointer-events-none flex items-center w-full"
                style={{
                  top: `${currentTimeTop}px`,
                  gridColumn: "1 / -1",
                }}
              ></div>
              {/* Background Columns (Venues) */}
              {venues.map((venue, i) => (
                <div
                  key={venue.id}
                  className="border-r border-gray-200 relative flex flex-col"
                  style={{ gridColumn: i + 1, gridRow: "1 / -1" }}
                >
                  {/* Venue Header - Sticky Top */}
                  <div className="sticky top-0 z-20 h-10 border-b border-gray-200 bg-gray-100 flex items-center justify-center font-semibold text-sm text-gray-700">
                    {venue.name}
                  </div>

                  {/* Venue Body (Grid Lines) */}
                  <div className="relative w-full">
                    {/* Grid Lines */}
                    {timeSlots.map((_, i) => (
                      <div
                        key={i}
                        className="border-b border-gray-100 w-full"
                        style={{ height: `${slotHeight}px` }}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Events Layer */}
              {events.map((event) => {
                const venueIndices = event.venueIds
                  .map((id) => venues.findIndex((v) => v.id === id))
                  .filter((i) => i !== -1);

                if (venueIndices.length === 0) return null;

                const minIndex = Math.min(...venueIndices);
                const maxIndex = Math.max(...venueIndices);

                const style = {
                  ...getEventStyle(event),
                  gridColumnStart: minIndex + 1,
                  gridColumnEnd: maxIndex + 2,
                  width: "auto",
                  left: 0,
                  right: 0,
                };

                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    style={style}
                    onDelete={() => onDeleteEvent(event.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
