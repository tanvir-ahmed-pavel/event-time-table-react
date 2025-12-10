import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { IVenue } from "../../../types/Event";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (eventData: {
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    venueIds: string[];
  }) => void;
  venues: IVenue[];
  initialDate?: Date;
}

export default function AddEventModal({
  isOpen,
  onClose,
  onAddEvent,
  venues,
  initialDate,
}: AddEventModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [selectedVenueIds, setSelectedVenueIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && initialDate) {
      setDate(initialDate.toISOString().split("T")[0]);
    }
    // Reset other fields on open if needed, or keep them
  }, [isOpen, initialDate]);

  const toggleVenue = (venueId: string) => {
    setSelectedVenueIds((prev) =>
      prev.includes(venueId)
        ? prev.filter((id) => id !== venueId)
        : [...prev, venueId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name ||
      !date ||
      !startTime ||
      !endTime ||
      selectedVenueIds.length === 0
    ) {
      alert(
        "Please fill in all required fields and select at least one venue."
      );
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    onAddEvent({
      name,
      description,
      date,
      startTime,
      endTime,
      venueIds: selectedVenueIds,
    });

    // Reset form
    setName("");
    setDescription("");
    setSelectedVenueIds([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Event</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Team Meeting"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional description..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venues (Select at least one)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
              {venues.map((venue) => (
                <label
                  key={venue.id}
                  className="flex items-center gap-2 text-sm cursor-pointer p-1 hover:bg-gray-100 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedVenueIds.includes(venue.id)}
                    onChange={() => toggleVenue(venue.id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="truncate">{venue.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
