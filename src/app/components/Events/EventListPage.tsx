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
      <div className="page-header">
        <h1>Discover Amazing Events</h1>
        <p className="page-subtitle">Find and book tickets for the best events in your area</p>
      </div>
      
      <EventFilter currentFilter={filter} onFilterChange={setFilter} />
      
      {filteredEvents.length === 0 ? (
        <div className="no-events">
          <div className="no-events-icon">🔍</div>
          <p>No events match your current filter.</p>
          <button onClick={() => setFilter("all")}>View All Events</button>
        </div>
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
