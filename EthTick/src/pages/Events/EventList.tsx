import React, { useState, useMemo, useEffect, useCallback } from "react";
// import { useEvents } from "../../contexts/EventContext"; // Assuming similar context or hook
import EventItem from "./EventItem";
import EventFilter from "./EventFilter";
import { Event } from "../../interfaces";
import { useReadContract } from "wagmi";
import { nftTicAbi } from "../../abi/NFTTic"; // You must provide the ABI file
// import { contractInfo } from "../../pages/util";
import { contractInfo } from "../../pages/util"; // Importing contract info from util.ts

// Sample Data - Replace with actual data fetching
const sampleEvents: Event[] = [
  {
    id: "1",
    name: "Tech Conference 2025",
    date: "2025-08-15",
    time: "09:00",
    location: "Online",
    description:
      "Join us for the biggest tech conference of the year. Learn about the latest trends in AI, Blockchain, and Web3.",
    price: 0,
    // cost: "0",
    maxTickets: 500,
    isFree: true,
    imageUrl:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "2",
    name: "Music Fest",
    date: "2025-09-05",
    time: "18:00",
    location: "City Park",
    description:
      "An outdoor music festival featuring top artists. Enjoy live music, food trucks, and more.",
    price: 75,
    // cost: "0.075",
    maxTickets: 1000,
    isFree: false,
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: "3",
    name: "Art Exhibition",
    date: "2025-07-20",
    time: "10:00",
    location: "Downtown Gallery",
    description:
      "Explore stunning artworks from local and international artists. A must-see for art lovers.",
    price: 20,
    // cost: "0.02",
    maxTickets: 200,
    isFree: false,
    imageUrl:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
];

const EventListPage: React.FC = () => {
  const CONTRACT_ADDRESS = contractInfo.address; // Use the address from util.ts
  const ABI = contractInfo.abi; // Use the ABI from util.ts

  // const [events, setEvents] = useState<Event[]>(sampleEvents); // Using sample data
  const [realEvents, setRealEvents] = useState<Event[]>(); // Using on-chain data
  const [isLoading, setIsLoading] = useState(false); // Placeholder
  const [error, setError] = useState<string | null>(null); // Placeholder

  const [filter, setFilter] = useState<
    "all" | "free" | "payable" | "cancelled"
  >("all");
  const contract_details = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getAllEvents",
    query: {
      staleTime: 5000, // Consider data fresh for 5 seconds (shorter for ticket updates)
      refetchInterval: 8000, // Refetch every 8 seconds to catch ticket purchases quickly
      refetchOnWindowFocus: false, // Prevent refetch on window focus
    },
  });

  // Memoize the event processing function to prevent unnecessary re-renders
  const processContractData = useCallback(() => {
    console.log(
      "Contract ABI getAllEvents:",
      nftTicAbi.find((f) => f.name === "getAllEvents")
    );
    console.log("Calling contract at:", CONTRACT_ADDRESS);

    if (Array.isArray(contract_details.data)) {
      console.log("✅ Contract read successful:");
      console.log("Raw contract details:", contract_details.data);
      const eventsFromChain = contract_details.data
        .filter((item: any) => !item.isCompleted) // Filter out completed events from homepage
        .map((item: any, index: number) => ({
          // Use the actual event ID from the smart contract (1-based)
          id: item.id?.toString() || (index + 1).toString(),
          name: item.name,
          date: item.date,
          time: item.time,
          location: item.location,
          description: item.desc,
          price: Number(item.cost), //wei value
          maxTickets: Number(item.maxTickets || 0), // maxTickets from contract represents remaining tickets
          isFree: item.cost === "0" || Number(item.cost) === 0,
          isCompleted: item.isCompleted || false,
          isCancelled: item.isCancelled || false,
          imageUrl:
            item.imageUrl ||
            "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80", // fallback image
        }));

      setRealEvents(eventsFromChain);
    } else if (contract_details.error) {
      console.error("❌ Contract read error:", contract_details.error);
    }
  }, [contract_details.data, contract_details.error, CONTRACT_ADDRESS]);

  useEffect(() => {
    processContractData();
  }, [processContractData]);

  const filteredEvents = useMemo(() => {
    // Prioritize blockchain events over sample events
    const eventsToShow = realEvents ?? [];

    let filtered: Event[] = [];

    if (filter === "free") {
      filtered = eventsToShow.filter(
        (event) => event.isFree && !event.isCancelled
      );
    } else if (filter === "payable") {
      filtered = eventsToShow.filter(
        (event) => !event.isFree && !event.isCancelled
      );
    } else if (filter === "cancelled") {
      filtered = eventsToShow.filter((event) => event.isCancelled);
    } else {
      // For "all" events, show all events but sort cancelled ones to the bottom
      filtered = eventsToShow;
    }

    // Sort events: active events first, then cancelled events
    if (filter === "all") {
      return filtered.sort((a, b) => {
        // If one is cancelled and the other isn't, put cancelled at the bottom
        if (a.isCancelled && !b.isCancelled) return 1;
        if (!a.isCancelled && b.isCancelled) return -1;

        // If both have the same cancellation status, sort by date (newest first)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    }

    return filtered;
  }, [realEvents, filter]);

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
