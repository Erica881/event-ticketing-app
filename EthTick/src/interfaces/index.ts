export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: number; // 0 for free events
  // cost: string; // ETH price as string
  maxTickets: number;
  isFree: boolean;
  imageUrl?: string; // Optional image URL
  isCompleted?: boolean; // Event completion status
  isCancelled?: boolean; // Event cancellation status
}

export interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  purchaseDate: string;
  // Add more ticket details if needed
}

export interface User {
  id: string;
  email: string;
  // Add other user properties if needed
}

export interface CreateEventByOrganiser {
  name: string;
  description: string;
  cost: string; // ETH price as string
  maxTickets: number;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  location: string;
  imageUrl?: string; // Optional image URL
}
