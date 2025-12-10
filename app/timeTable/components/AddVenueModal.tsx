import { X } from "lucide-react";
import { useState } from "react";

interface AddVenueModalProps {
  onClose: () => void;
  onAddVenue: (name: string) => void;
}

export default function AddVenueModal({
  onClose,
  onAddVenue,
}: AddVenueModalProps) {
  const [newVenueName, setNewVenueName] = useState("");

  const handleSubmit = () => {
    if (newVenueName.trim()) {
      onAddVenue(newVenueName);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Venue</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Venue Name"
          className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newVenueName}
          onChange={(e) => setNewVenueName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Venue
          </button>
        </div>
      </div>
    </div>
  );
}
