import React from "react";

interface EventFilterProps {
  currentFilter: "all" | "free" | "payable";
  onFilterChange: (filter: "all" | "free" | "payable") => void;
}

const EventFilter: React.FC<EventFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="filter-container">
      <label htmlFor="eventFilter">Filter Events: </label>
      <select
        id="eventFilter"
        value={currentFilter}
        onChange={(e) =>
          onFilterChange(e.target.value as "all" | "free" | "payable")
        }
      >
        <option value="all">All Events</option>
        <option value="free">Free Events</option>
        <option value="payable">Payable Events</option>
      </select>
    </div>
  );
};

export default EventFilter;
