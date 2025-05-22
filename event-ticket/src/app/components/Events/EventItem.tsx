import React from "react";
import { Event } from "../../interfaces";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleString();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // TODO: Implement ticket purchase logic
    alert("Purchase functionality will be implemented soon!");
  };

  return (
    <div className="event-item">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.name}
          style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }}
        />
      )}
      <div className="event-content">
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
      </div>
      <button 
        className="buy-button"
        onClick={handleBuyClick}
      >
        {event.isFree ? "Register Now" : "Buy Ticket"}
      </button>
    </div>
  );
};

export default EventItem;
