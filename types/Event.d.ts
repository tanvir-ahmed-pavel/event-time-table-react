// Core Data Models

export interface IVenue {
  id: string;
  name: string;
}

export interface IEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venueIds: string[];
  dateStr: string;
}

export interface IDateNode {
  dateStr: string;
  dateObj: Date;
}
