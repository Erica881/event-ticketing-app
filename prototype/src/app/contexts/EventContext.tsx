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

// Mock initial events with high-quality images
const initialEvents: Event[] = [
  {
    id: "1",
    name: "Tech Innovation Summit 2025",
    date: "2025-09-15T09:00:00",
    location: "Grand Convention Center",
    description: "Join industry leaders and visionaries to explore cutting-edge technologies shaping our future. Network with experts, attend workshops, and discover the next big innovations in AI, blockchain, and more.",
    price: 149.99,
    isFree: false,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "2",
    name: "Urban Art Exhibition",
    date: "2025-10-05T11:00:00",
    location: "Downtown Cultural Park",
    description: "Experience the vibrant world of urban art with installations from over 50 local and international artists. This free exhibition celebrates street art, graffiti, and contemporary urban expression.",
    price: 0,
    isFree: true,
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
  },
  {
    id: "3",
    name: "Summer Music Festival",
    date: "2025-08-20T15:00:00",
    location: "Riverside Amphitheater",
    description: "Three days of non-stop music featuring top artists across multiple genres. Enjoy food vendors, art installations, and unforgettable performances under the summer sky.",
    price: 89.50,
    isFree: false,
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "4",
    name: "Community Coding Workshop",
    date: "2025-11-10T14:00:00",
    location: "Tech Hub Community Center",
    description: "Learn the fundamentals of programming in this beginner-friendly workshop. No prior experience needed! Our expert instructors will guide you through the basics of web development.",
    price: 0,
    isFree: true,
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "5",
    name: "Culinary Masterclass",
    date: "2025-07-25T18:30:00",
    location: "Gourmet Cooking Academy",
    description: "Join celebrity chef Maria Rodriguez for an exclusive cooking masterclass. Learn professional techniques, secret recipes, and enjoy a tasting session of all prepared dishes.",
    price: 75.00,
    isFree: false,
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "6",
    name: "Wellness & Yoga Retreat",
    date: "2025-08-05T08:00:00",
    location: "Serenity Gardens",
    description: "A full day of mindfulness, yoga, and wellness activities designed to rejuvenate your body and mind. Includes guided meditation sessions, yoga classes for all levels, and healthy refreshments.",
    price: 45.00,
    isFree: false,
    imageUrl: "https://images.unsplash.com/photo-1599447292461-74fb7d35b3be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  }
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
