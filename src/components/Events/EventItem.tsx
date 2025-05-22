import React from "react";
import { Event } from "../../interfaces";

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleString();

  return (
    <div className="event-item">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.name}
          style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }}
        />
      )}
      <h3>{event.name}</h3>
      <p>
        <strong>Date:</strong> {formattedDate}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Price:</strong>{" "}
        {event.isFree ? "Free" : `$${event.price.toFixed(2)}`}
      </p>
      <p>{event.description}</p>
      {/* Add a "Buy Ticket" button or link here if needed */}
    </div>
  );
};

export default EventItem;
