import React, { useState, useMemo } from "react";
import { useEvents } from "../../contexts/EventContext";
import EventItem from "./EventItem";
import EventFilter from "./EventFilter";
import { Event } from "../../interfaces";

const EventListPage: React.FC = () => {
  const { events, isLoading, error } = useEvents();
  const [filter, setFilter] = useState<"all" | "free" | "payable">("all");

  const filteredEvents = useMemo(() => {
    if (filter === "free") {
      return events.filter((event) => event.isFree);
    }
    if (filter === "payable") {
      return events.filter((event) => !event.isFree);
    }
    return events;
  }, [events, filter]);

  if (isLoading)
    return (
      <div className="container">
        <p>Loading events...</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p>Error loading events: {error}</p>
      </div>
    );

  return (
    <div className="container">
      <h1>Upcoming Events</h1>
      <EventFilter currentFilter={filter} onFilterChange={setFilter} />
      {filteredEvents.length === 0 ? (
        <p>No events match the current filter.</p>
      ) : (
        <div className="event-list">
          {filteredEvents.map((event: Event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventListPage;
