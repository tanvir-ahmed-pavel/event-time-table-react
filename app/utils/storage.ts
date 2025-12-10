import type { IEvent, IVenue } from "../../types/Event";

const VENUES_KEY = "event_timetable_venues";
const EVENTS_KEY = "event_timetable_events";

// Seeder Data
const INITIAL_VENUES: IVenue[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `venue-${i + 1}`,
  name: `Venue ${i + 1}`,
}));

// Helper to get stored venues raw
const getStoredVenuesRaw = (): IVenue[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(VENUES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getVenues = (): IVenue[] => {
  if (typeof window === "undefined") return [];

  const storedVenues = getStoredVenuesRaw();
  const initialIds = new Set(INITIAL_VENUES.map((v) => v.id));

  const mergedVenues = [...INITIAL_VENUES];

  storedVenues.forEach((v) => {
    if (!initialIds.has(v.id)) {
      mergedVenues.push(v);
    }
  });

  if (JSON.stringify(storedVenues) !== JSON.stringify(mergedVenues)) {
    localStorage.setItem(VENUES_KEY, JSON.stringify(mergedVenues));
  }

  return mergedVenues;
};

export const addVenue = (name: string): IVenue => {
  const venues = getVenues();
  const newVenue: IVenue = {
    id: `venue-${Date.now()}`,
    name,
  };
  venues.push(newVenue);
  localStorage.setItem(VENUES_KEY, JSON.stringify(venues));
  return newVenue;
};

export const getEvents = (): IEvent[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(EVENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getEventsForDate = (dateStr: string): IEvent[] => {
  const allEvents = getEvents();
  return allEvents.filter((e) => e.dateStr === dateStr);
};

// Create Event
export const createEvent = (event: IEvent) => {
  const events = getEvents();
  events.push(event);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

// Helper to generate ISO Date string key (YYYY-MM-DD)
export const toDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Seeder for Events (optional, for testing)
export const seedEvents = () => {
  const existing = getEvents();
  if (existing.length > 0) return;

  const today = new Date();
  const dateKey = toDateKey(today);

  // Create a sample event
  // 10:00 to 11:30 at Venue 1
  const start = new Date(today);
  start.setHours(10, 0, 0, 0);

  const end = new Date(today);
  end.setHours(11, 30, 0, 0);

  const sampleEvent: IEvent = {
    id: "evt-1",
    name: "Morning Standup",
    description: "Daily team sync",
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    venueIds: ["venue-1", "venue-2"],
    dateStr: dateKey,
  };

  createEvent(sampleEvent);
};
