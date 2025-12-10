// Core Data Models

export interface IVenue {
  id: string;
  name: string;
}

export interface IEvent {
  id: string;
  name: string;
  description: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  venueIds: string[];
}

export interface IDateNode {
  dateStr: string;
  dateObj: Date;
}
