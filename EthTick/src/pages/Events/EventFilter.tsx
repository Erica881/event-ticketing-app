import React from "react";

interface EventFilterProps {
  currentFilter: "all" | "free" | "payable" | "cancelled";
  onFilterChange: (filter: "all" | "free" | "payable" | "cancelled") => void;
}

const EventFilter: React.FC<EventFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="filter-container">
      <div className="filter-icon">🔍</div>
      <label htmlFor="eventFilter">Show me: </label>
      <select
        id="eventFilter"
        value={currentFilter}
        onChange={(e) =>
          onFilterChange(e.target.value as "all" | "free" | "payable" | "cancelled")
        }
      >
        <option value="all">All Events</option>
        <option value="free">Free Events Only</option>
        <option value="payable">Paid Events Only</option>
        <option value="cancelled">Cancelled Events</option>
      </select>
      
      <div className="filter-count">
        Showing {currentFilter === "all" ? "all" : currentFilter === "free" ? "free" : currentFilter === "payable" ? "paid" : "cancelled"} events
      </div>
    </div>
  );
};

export default EventFilter;