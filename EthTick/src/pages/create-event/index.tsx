"use client";
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import Navbar from "../Navbar";
import Link from "next/link";

export default function CreateEvent() {
  const { address, isConnected } = useAccount();
  const { data: hash, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Sample Data - Replace with actual data fetching
  const sampleCreatedEventsBy: Event[] = [
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

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Event Created</h1>
        </div>
      </div>

      <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-indigo-600">
            {/* {ticket.eventName} */}
            Ticket event name
          </h3>
          <p className="text-sm text-gray-500">
            {/* {ticket.date} • {ticket.time} */}
            date and time
          </p>
          <p className="text-sm text-gray-500">
            {/* {ticket.venue} */}
            location
          </p>
        </div>

        <div className="border-t border-dashed my-4"></div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Ticket ID</p>
            <p className="font-mono font-semibold text-gray-800">
              {/* {ticket.ticketId} */}
              event Id
            </p>
          </div>
        </div>
      </div>

      <div className="navbar-logo">
        <Link href="/create-event/create-event-form">Create Event</Link>
      </div>
    </>
  );
}
