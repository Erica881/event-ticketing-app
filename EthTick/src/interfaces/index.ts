export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: number; // 0 for free events
  cost: string; // ETH price as string
  maxTickets: number;
  isFree: boolean;
  imageUrl?: string; // Optional image URL
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