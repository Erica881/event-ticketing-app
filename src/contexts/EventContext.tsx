import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Event } from "../interfaces";

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, "id" | "isFree">) => void; // Omit id as it's usually backend generated
  isLoading: boolean;
  error: string | null;
}

// Mock initial events
const initialEvents: Event[] = [
  {
    id: "1",
    name: "Tech Conference 2025",
    date: "2025-09-15T09:00:00",
    location: "Convention Center",
    description: "The future of tech.",
    price: 100,
    isFree: false,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Tech+Conf",
  },
  {
    id: "2",
    name: "Local Art Fair",
    date: "2025-10-05T11:00:00",
    location: "City Park",
    description: "Discover local artists.",
    price: 0,
    isFree: true,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Art+Fair",
  },
  {
    id: "3",
    name: "Music Festival",
    date: "2025-08-20T15:00:00",
    location: "Open Grounds",
    description: "Live bands and fun.",
    price: 50,
    isFree: false,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Music+Fest",
  },
  {
    id: "4",
    name: "Community Workshop: Coding Basics",
    date: "2025-11-10T14:00:00",
    location: "Community Hall",
    description: "Learn to code for free!",
    price: 0,
    isFree: true,
  },
];

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching events
    setIsLoading(true);
    setTimeout(() => {
      setEvents(initialEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  const addEvent = (newEventData: Omit<Event, "id" | "isFree">) => {
    // Simulate adding event and getting back the full event object from an API
    const newEvent: Event = {
      ...newEventData,
      id: Math.random().toString(36).substr(2, 9), // Generate a mock ID
      isFree: newEventData.price === 0,
    };
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
  };

  return (
    <EventContext.Provider value={{ events, addEvent, isLoading, error }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
