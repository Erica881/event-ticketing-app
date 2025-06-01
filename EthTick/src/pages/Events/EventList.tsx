import React, { useState, useMemo, useEffect } from "react";
// import { useEvents } from "../../contexts/EventContext"; // Assuming similar context or hook
import EventItem from "./EventItem";
import EventFilter from "./EventFilter";
import { Event } from "../../interfaces";
import { useAccount, useReadContract } from "wagmi";
import { nftTicAbi } from "../../abi/NFTTic"; // You must provide the ABI file

// Sample Data - Replace with actual data fetching
const sampleEvents: Event[] = [
  {
    id: "1",
    name: "Tech Conference 2025",
    date: "2025-08-15T09:00:00Z",
    location: "Online",
    description:
      "Join us for the biggest tech conference of the year. Learn about the latest trends in AI, Blockchain, and Web3.",
    price: 0,
    isFree: true,
    imageUrl:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "2",
    name: "Music Fest",
    date: "2025-09-05T18:00:00Z",
    location: "City Park",
    description:
      "An outdoor music festival featuring top artists. Enjoy live music, food trucks, and more.",
    price: 75,
    isFree: false,
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: "3",
    name: "Art Exhibition",
    date: "2025-07-20T10:00:00Z",
    location: "Downtown Gallery",
    description:
      "Explore stunning artworks from local and international artists. A must-see for art lovers.",
    price: 20,
    isFree: false,
    imageUrl:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
];

const EventListPage: React.FC = () => {
  // const { events, isLoading, error } = useEvents(); // Placeholder for data fetching
  const CONTRACT_ADDRESS = "0xc753037F5C01FfA0864aaf499C93D6Fa221613C3"; // Replace with actual deployed contract address

  const [events, setEvents] = useState<Event[]>(sampleEvents); // Using sample data
  const [realEvents, setRealEvents] = useState<Event[]>(); // Using sample data
  const [isLoading, setIsLoading] = useState(false); // Placeholder
  const [error, setError] = useState<string | null>(null); // Placeholder

  const [filter, setFilter] = useState<"all" | "free" | "payable">("all");
  const contract_details = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: nftTicAbi,
    functionName: "getAllOccasions",
  });

  useEffect(() => {
    if (Array.isArray(contract_details.data)) {
      console.log("✅ Contract read successful:");
      console.log("Raw contract details:", contract_details.data);
      const eventsFromChain = contract_details.data.map(
        (item: any, index: number) => ({
          id: item.id?.toString() || index.toString(),
          name: item.name,
          date: item.date,
          time: item.time,
          location: item.location,
          description: item.description,
          price: Number(item.cost), //wei value
          isFree: item.cost === "0",
          imageUrl:
            "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80", // fallback image
        })
      );

      setRealEvents(eventsFromChain);
    }

    if (contract_details.error) {
      console.error("❌ Contract read error:", contract_details.error);
    }
  }, [contract_details.data, contract_details.error]);

  // const filteredEvents = useMemo(() => {
  //   if (filter === "free") {
  //     return events.filter((event) => event.isFree);
  //   }
  //   if (filter === "payable") {
  //     return events.filter((event) => !event.isFree);
  //   }
  //   return events;
  // }, [events, filter]);

  const filteredEvents = useMemo(() => {
    const combined = [...events, ...(realEvents || [])];

    if (filter === "free") {
      return combined.filter((event) => event.isFree);
    }
    if (filter === "payable") {
      return combined.filter((event) => !event.isFree);
    }
    return combined;
  }, [events, realEvents, filter]);

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
        <p className="page-subtitle">
          Find and book tickets for the best events in your area
        </p>
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
