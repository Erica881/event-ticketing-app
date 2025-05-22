import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../contexts/EventContext";
import { Event } from "../../interfaces";

const CreateEventPage: React.FC = () => {
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !location || !description) {
      alert("Please fill in all required fields.");
      return;
    }
    const newEvent: Omit<Event, "id" | "isFree"> = {
      // isFree will be derived from price
      name,
      date,
      location,
      description,
      price: Number(price),
      imageUrl: imageUrl || undefined,
    };
    addEvent(newEvent);
    alert("Event created successfully!");
    navigate("/"); // Redirect to homepage
  };

  return (
    <div className="form-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventDate">Date and Time:</label>
          <input
            type="datetime-local"
            id="eventDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventLocation">Location:</label>
          <input
            type="text"
            id="eventLocation"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventDescription">Description:</label>
          <textarea
            id="eventDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventPrice">Price (enter 0 for free):</label>
          <input
            type="number"
            id="eventPrice"
            value={price}
            min="0"
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="eventImageUrl">Image URL (Optional):</label>
          <input
            type="text"
            id="eventImageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEventPage;
