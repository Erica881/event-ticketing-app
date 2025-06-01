import React, { useState } from "react";
import { Event } from "../interfaces";
// import { useAuth } from "../../contexts/AuthContext"; // Assuming similar context or hook
import { useRouter } from "next/router"; // Using next/router

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  // const { isAuthenticated } = useAuth(); // Placeholder for auth
  const isAuthenticated = true; // Replace with actual auth check
  const router = useRouter();

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      router.push("/login"); // Or your login page
      return;
    }
    // TODO: Implement ticket purchase logic
    alert("Purchase functionality will be implemented soon!");
  };

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) { // Max 10 tickets
      setQuantity(newQuantity);
    }
  };

  const imageUrl = event.imageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  return (
    <div className="event-item">
      <div className="event-image-container">
        <img
          src={imageUrl}
          alt={event.name}
          className="event-image"
        />
        <div className="event-date-badge">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      <div className="event-content">
        <h3>{event.name}</h3>
        <p className="event-time">
          <i className="event-icon">🕒</i> {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="event-location">
          <i className="event-icon">📍</i> {event.location}
        </p>
        <p className="event-price">
          <i className="event-icon">{event.isFree ? '🎁' : '💰'}</i> 
          {event.isFree ? "Free Entry" : `$${event.price.toFixed(2)}`}
        </p>
        <p className="event-description">{event.description}</p>
        
        {!event.isFree && (
          <div className="ticket-quantity">
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="quantity-display">{quantity}</span>
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 10}
            >
              +
            </button>
          </div>
        )}
      </div>
      
      <button 
        className="buy-button"
        onClick={handleBuyClick}
      >
        {event.isFree ? "Register Now" : `Purchase Ticket${quantity > 1 ? 's' : ''} • $${(event.price * quantity).toFixed(2)}`}
      </button>
    </div>
  );
};

export default EventItem;