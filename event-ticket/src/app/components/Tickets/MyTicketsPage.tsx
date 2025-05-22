import React, { useState, useEffect } from "react";
import { Ticket } from "../../interfaces";
// import { useAuth } from '../../contexts/AuthContext'; // If tickets are user-specific

const MyTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const { user } = useAuth(); // Get current user if tickets are fetched based on user ID

  useEffect(() => {
    // Simulate fetching tickets for the logged-in user
    // In a real app, you'd make an API call here, possibly using user.id
    setIsLoading(true);
    setTimeout(() => {
      // For now, it's always empty as per the requirement
      setTickets([]);
      setIsLoading(false);
    }, 500);
  }, []); // Add 'user' to dependency array if fetching user-specific tickets

  if (isLoading) {
    return (
      <div className="container">
        <p>Loading your tickets...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>My Tickets</h2>
      {tickets.length === 0 ? (
        <p>You currently have no tickets.</p>
      ) : (
        <div>
          {tickets.map((ticket) => (
            <div key={ticket.id} className="event-item">
              {" "}
              {/* Re-using event-item style for simplicity */}
              <h3>Ticket for: {ticket.eventName}</h3>
              <p>
                Purchased on:{" "}
                {new Date(ticket.purchaseDate).toLocaleDateString()}
              </p>
              <p>Ticket ID: {ticket.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
