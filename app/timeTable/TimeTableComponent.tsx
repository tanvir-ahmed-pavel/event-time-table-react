import { Plus, Calendar, MapPin } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { IVenue, IEvent } from "../../types/Event";
import {
  getVenues,
  getEventsForDate,
  toDateKey,
  seedEvents,
  addVenue,
  getEvents,
  createEvent,
  deleteEvent,
} from "../utils/storage";
import AddVenueModal from "./components/AddVenueModal";
import AddEventModal from "./components/AddEventModal";
import DateHeader from "./components/DateHeader";
import TimetableGrid from "./components/TimetableGrid";

export default function TimeTableComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date()); // Date used to calculate the visible week
  const [isAnimating, setIsAnimating] = useState(false);

  // Modal State
  const [isAddVenueOpen, setIsAddVenueOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  // Data State
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);

  // Constants
  const SLOT_HEIGHT = 50;
  const HEADER_HEIGHT = 40;
  const TOP_ROW_OFFSET_MARGIN = 8;

  // Initialize Data
  useEffect(() => {
    // Seed basic data if needed
    seedEvents();

    // Load Venues (Global)
    const loadedVenues = getVenues();
    setVenues(loadedVenues);
    // Load venues
    const storedVenues = getVenues();
    setVenues(storedVenues);

    // Load events
    const allEvents = getEvents();
    setEvents(allEvents);
  }, []);

  // Load Events when Date changes (currentDate is used for filtering events for a specific day)
  useEffect(() => {
    const dateKey = toDateKey(currentDate);
    const dayEvents = getEventsForDate(dateKey);
  }, [currentDate]);

  // Generate 15-min time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const timeString = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, []);

  // Generate the 7 days for the CURRENT VIEWED week
  const startOfWeek = new Date(viewDate);
  const day = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  startOfWeek.setDate(diff);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const changeWeek = (direction: "prev" | "next") => {
    setIsAnimating(true);
    setTimeout(() => {
      const newDate = new Date(viewDate);
      newDate.setDate(viewDate.getDate() + (direction === "next" ? 7 : -7));
      setViewDate(newDate);
      setIsAnimating(false);
    }, 150); // Match transition duration
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setViewDate(today);
  };

  const handleAddVenue = (name: string) => {
    const newVenue = addVenue(name);
    setVenues((prev) => [...prev, newVenue]);
    setIsAddVenueOpen(false);
  };

  const handleAddEvent = (eventData: {
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    venueIds: string[];
  }) => {
    // Helper to convert HH:MM to minutes for comparison
    const timeToMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const newStart = timeToMinutes(eventData.startTime);
    const newEnd = timeToMinutes(eventData.endTime);

    // Conflict Check
    // 1. Get events for this day
    const dayEvents = events.filter((e) => e.date === eventData.date);

    // 2. Check each selected venue for overlap
    for (const venueId of eventData.venueIds) {
      // Find events in this venue
      const venueEvents = dayEvents.filter((e) => e.venueIds.includes(venueId));

      for (const existingEvent of venueEvents) {
        const existingStart = timeToMinutes(existingEvent.startTime);
        const existingEnd = timeToMinutes(existingEvent.endTime);

        // Check overlap: (StartA < EndB) && (EndA > StartB)
        const hasOverlap = newStart < existingEnd && newEnd > existingStart;

        if (hasOverlap) {
          const venueName =
            venues.find((v) => v.id === venueId)?.name || venueId;
          alert(
            `Conflict detected!\n\n"${existingEvent.name}" is already scheduled in ${venueName} during this time (${existingEvent.startTime} - ${existingEvent.endTime}).`
          );
          return;
        }
      }
    }

    const newEvent: IEvent = {
      id: `evt-${Date.now()}`,
      name: eventData.name,
      description: eventData.description,
      date: eventData.date,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      venueIds: eventData.venueIds,
    };

    createEvent(newEvent);
    setEvents((prev) => [...prev, newEvent]);
    setIsAddEventOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const getEventCount = (date: Date): number => {
    const key = toDateKey(date);
    return events.filter((e) => e.date === key).length;
  };

  return (
    <div className="border border-gray-500 h-screen w-screen flex flex-col items-center overflow-hidden bg-white text-black relative">
      {/* Add Venue Modal */}
      {isAddVenueOpen && (
        <AddVenueModal
          onClose={() => setIsAddVenueOpen(false)}
          onAddVenue={handleAddVenue}
        />
      )}

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onAddEvent={handleAddEvent}
        venues={venues}
        initialDate={currentDate}
      />

      <div className="flex flex-col w-full h-full">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white shrink-0">
          <h1 className="font-bold text-lg text-gray-800">Event Timetable</h1>
          <button
            onClick={handleGoToToday}
            className="cursor-pointer px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
          >
            Today
          </button>
        </div>

        {/* Date Navigation Header */}
        <DateHeader
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onWeekChange={changeWeek}
          isAnimating={isAnimating}
          days={days}
          getEventCount={getEventCount}
        />

        {/* Schedule Grid Area */}
        <TimetableGrid
          venues={venues}
          events={events.filter((e) => e.date === toDateKey(currentDate))}
          timeSlots={timeSlots}
          slotHeight={SLOT_HEIGHT}
          headerHeight={HEADER_HEIGHT}
          topRowOffsetMargin={TOP_ROW_OFFSET_MARGIN}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>
      {/* Floating Action Button Group */}
      <div
        className="absolute bottom-8 right-8 flex flex-col items-end gap-4 z-50"
        onMouseLeave={() => setIsFabMenuOpen(false)}
      >
        <div
          className={`flex flex-col items-end gap-3 transition-all duration-300 transform ${
            isFabMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 translate-y-10 invisible"
          }`}
        >
          <button
            onClick={() => setIsAddVenueOpen(true)}
            className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-sm font-medium">Add Venue</span>
            <MapPin size={20} />
          </button>
          <button
            onClick={() => setIsAddEventOpen(true)}
            className="cursor-pointer flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition-colors"
          >
            <span className="text-sm font-medium">Add Event</span>
            <Calendar size={20} />
          </button>
        </div>

        {/* Main Floating Button */}
        <button
          className={`bg-indigo-500 bg-opacity-20 text-white p-4 rounded-full shadow-xl hover:bg-indigo-600 transition-all transform ${
            isFabMenuOpen ? "rotate-45" : ""
          }`}
          onMouseEnter={() => setIsFabMenuOpen(true)}
        >
          <Plus size={32} />
        </button>
      </div>
    </div>
  );
}
