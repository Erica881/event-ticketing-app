"use client";

import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "./Navbar";
import { useAccount, useReadContract } from "wagmi";
import { Ticket } from "../interfaces";
import { contractInfo } from "./util";

// Extended ticket interface with blockchain data
interface MyTicket extends Ticket {
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketPrice: number;
  isFree: boolean;
  isEventCompleted: boolean;
  isEventCancelled: boolean;
  tokenId: string;
  transactionHash?: string;
}

const MyTickets: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [tickets, setTickets] = useState<MyTicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");

  // Fetch user's tickets from the blockchain
  const { data: userTickets, isError, isLoading: isLoadingTickets } = useReadContract({
    abi: contractInfo.abi,
    address: contractInfo.address as `0x${string}`,
    functionName: "getTicketsByOwner",
    args: [address],
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Process tickets data
  useEffect(() => {
    const processTickets = async () => {
      if (!userTickets || !Array.isArray(userTickets)) {
        setTickets([]);
        return;
      }

      setIsLoading(true);
      try {
        // In a real implementation, you would process the blockchain data
        // For now, we'll create some mock data structure
        const processedTickets: MyTicket[] = [];
        
        // This is placeholder logic - replace with actual blockchain data processing
        if (userTickets.length > 0) {
          // Process each ticket from blockchain
          userTickets.forEach((ticket: any, index: number) => {
            const processedTicket: MyTicket = {
              id: `ticket-${index}`,
              eventId: ticket.eventId?.toString() || `event-${index}`,
              eventName: ticket.eventName || "Sample Event",
              purchaseDate: new Date().toISOString(),
              eventDate: ticket.eventDate || "2024-12-31",
              eventTime: ticket.eventTime || "19:00",
              eventLocation: ticket.eventLocation || "Sample Venue",
              ticketPrice: Number(ticket.price) || 0,
              isFree: ticket.isFree || false,
              isEventCompleted: ticket.isCompleted || false,
              isEventCancelled: ticket.isCancelled || false,
              tokenId: ticket.tokenId?.toString() || `${index}`,
            };
            processedTickets.push(processedTicket);
          });
        }

        setTickets(processedTickets);
      } catch (error) {
        console.error("Error processing tickets:", error);
        setTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    processTickets();
  }, [userTickets]);

  // Filter tickets based on selected filter
  const filteredTickets = tickets.filter(ticket => {
    const eventDate = new Date(ticket.eventDate);
    const now = new Date();
    
    switch (filter) {
      case "upcoming":
        return !ticket.isEventCompleted && !ticket.isEventCancelled && eventDate > now;
      case "completed":
        return ticket.isEventCompleted;
      case "cancelled":
        return ticket.isEventCancelled;
      default:
        return true;
    }
  });

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTicketStatus = (ticket: MyTicket) => {
    if (ticket.isEventCancelled) return { status: "Cancelled", className: "cancelled" };
    if (ticket.isEventCompleted) return { status: "Completed", className: "completed" };
    
    const eventDate = new Date(ticket.eventDate);
    const now = new Date();
    
    if (eventDate < now) return { status: "Past Event", className: "past" };
    return { status: "Upcoming", className: "upcoming" };
  };

  return (
    <div>
      <Head>
        <title>My Tickets - EthTick</title>
        <meta name="description" content="View your purchased event tickets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container">
        <div className="page-header">
          <h1>My Tickets</h1>
          <p className="page-subtitle">
            View and manage all your purchased event tickets
          </p>
          {isConnected && address && (
            <div className="wallet-address-display">
              Connected Wallet: {formatAddress(address)}
            </div>
          )}
        </div>

        {!isConnected ? (
          <div className="wallet-warning">
            <span>⚠️</span>
            <p>Please connect your wallet to view your tickets</p>
          </div>
        ) : (
          <>
            {/* Filter Section */}
            <div className="filter-container">
              <span className="filter-icon">🎫</span>
              <label htmlFor="ticket-filter">Filter tickets:</label>
              <select
                id="ticket-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <option value="all">All Tickets</option>
                <option value="upcoming">Upcoming Events</option>
                <option value="completed">Completed Events</option>
                <option value="cancelled">Cancelled Events</option>
              </select>
            </div>

            {/* Loading State */}
            {(isLoadingTickets || isLoading) && (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading your tickets...</p>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="error-state">
                <p>Failed to load tickets. Please try again.</p>
              </div>
            )}

            {/* Tickets List */}
            {!isLoadingTickets && !isLoading && !isError && (
              <div className="tickets-grid">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => {
                    const ticketStatus = getTicketStatus(ticket);
                    return (
                      <div key={ticket.id} className="ticket-card">
                        <div className="ticket-header">
                          <h3>{ticket.eventName}</h3>
                          <div className={`ticket-status ${ticketStatus.className}`}>
                            {ticketStatus.status}
                          </div>
                        </div>
                        
                        <div className="ticket-content">
                          <div className="ticket-details">
                            <div className="detail-item">
                              <span className="detail-icon">📅</span>
                              <span className="detail-label">Date:</span>
                              <span className="detail-value">
                                {new Date(ticket.eventDate).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            
                            <div className="detail-item">
                              <span className="detail-icon">🕒</span>
                              <span className="detail-label">Time:</span>
                              <span className="detail-value">{ticket.eventTime}</span>
                            </div>
                            
                            <div className="detail-item">
                              <span className="detail-icon">📍</span>
                              <span className="detail-label">Location:</span>
                              <span className="detail-value">{ticket.eventLocation}</span>
                            </div>
                            
                            <div className="detail-item">
                              <span className="detail-icon">💰</span>
                              <span className="detail-label">Price:</span>
                              <span className="detail-value">
                                {ticket.isFree ? "Free Entry" : `${ticket.ticketPrice} wei`}
                              </span>
                            </div>
                            
                            <div className="detail-item">
                              <span className="detail-icon">🎫</span>
                              <span className="detail-label">Token ID:</span>
                              <span className="detail-value">#{ticket.tokenId}</span>
                            </div>
                            
                            <div className="detail-item">
                              <span className="detail-icon">📦</span>
                              <span className="detail-label">Purchased:</span>
                              <span className="detail-value">
                                {new Date(ticket.purchaseDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ticket-actions">
                          {!ticket.isEventCancelled && !ticket.isEventCompleted && (
                            <button className="action-btn view-details-btn">
                              View Event Details
                            </button>
                          )}
                          
                          {ticket.isEventCancelled && (
                            <button className="action-btn refund-btn">
                              Request Refund
                            </button>
                          )}
                          
                          <button className="action-btn download-btn">
                            Download Ticket
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-tickets">
                    <div className="no-tickets-icon">🎫</div>
                    <h3>No tickets found</h3>
                    <p>
                      {filter === "all" 
                        ? "You haven't purchased any tickets yet."
                        : `No ${filter} tickets found.`}
                    </p>
                    <a href="/" className="browse-events-btn">
                      Browse Events
                    </a>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MyTickets;