"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../Navbar";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Ticket } from "../../interfaces";
import { contractInfo, getTicketsBoughtByUser } from "../util";

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
  
  // Contract interaction hooks for refund
  const { writeContract, data: refundHash, error: refundError, isPending: isRefundPending } = useWriteContract();
  const { isLoading: isRefundConfirming, isSuccess: isRefundConfirmed } =
    useWaitForTransactionReceipt({
      hash: refundHash,
    });

  // Fetch user's NFT balance (number of tickets owned)
  const { data: userBalance, isError: balanceError, isLoading: isLoadingBalance } = useReadContract({
    abi: contractInfo.abi,
    address: contractInfo.address as `0x${string}`,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address && isConnected,
      staleTime: 30000, // Consider data fresh for 30 seconds
      refetchInterval: false, // Disable automatic refetching for balance
    },
  });

  // Fetch all events to match with user's tickets
  const { data: allEvents, isError: eventsError, isLoading: isLoadingEvents } = useReadContract({
    abi: contractInfo.abi,
    address: contractInfo.address as `0x${string}`,
    functionName: "getAllEvents",
    query: {
      enabled: !!address && isConnected,
      staleTime: 20000, // Consider data fresh for 20 seconds
      refetchInterval: 30000, // Refetch every 30 seconds instead of default
    },
  });

  const isError = balanceError || eventsError;
  const isLoadingTickets = isLoadingBalance || isLoadingEvents;

  // Memoize the processTickets function to prevent unnecessary re-renders
  const processTickets = useCallback(async () => {
    if (!allEvents || !Array.isArray(allEvents) || !address) {
      setTickets([]);
      return;
    }

    setIsLoading(true);
    try {
      const processedTickets: MyTicket[] = [];
      
      // Get purchased events from localStorage (tracking from EventItem purchases)
      const purchasedEvents = JSON.parse(localStorage.getItem(`purchased_events_${address}`) || '[]');
      
      // Check each purchased event and create ticket entries
      for (const purchasedEventId of purchasedEvents) {
        const event = allEvents.find(e => e.id?.toString() === purchasedEventId.toString());
        
        if (event) {
          const processedTicket: MyTicket = {
            id: `ticket-${event.id}`,
            eventId: event.id?.toString() || purchasedEventId.toString(),
            eventName: event.name || "Event",
            purchaseDate: new Date().toISOString(),
            eventDate: event.date || "2024-12-31",
            eventTime: event.time || "19:00",
            eventLocation: event.location || "Venue",
            ticketPrice: Number(event.cost) || 0,
            isFree: event.cost === "0" || Number(event.cost) === 0,
            isEventCompleted: event.isCompleted || false,
            isEventCancelled: event.isCancelled || false,
            tokenId: `${Date.now()}`, // Simplified token ID
          };
          processedTickets.push(processedTicket);
        }
      }

      setTickets(processedTickets);
    } catch (error) {
      console.error("Error processing tickets:", error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, [allEvents, address]);

  // Process tickets data
  useEffect(() => {
    processTickets();
  }, [processTickets]);

  // Handle refund functionality
  const handleRefund = async (eventId: string) => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      await writeContract({
        address: contractInfo.address as `0x${string}`,
        abi: contractInfo.abi,
        functionName: 'claimRefund',
        args: [BigInt(eventId)],
      });

      // Store the refunded event ID to remove it after successful refund
      sessionStorage.setItem('refundedEventId', eventId);
      
    } catch (err) {
      console.error('Refund failed:', err);
      alert(`Refund failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Show refund success message and remove ticket from localStorage
  React.useEffect(() => {
    if (isRefundConfirmed && address) {
      const refundedEventId = sessionStorage.getItem('refundedEventId');
      
      if (refundedEventId) {
        // Remove the refunded event from purchased events in localStorage
        const purchasedEvents = JSON.parse(localStorage.getItem(`purchased_events_${address}`) || '[]');
        const updatedEvents = purchasedEvents.filter((eventId: string) => eventId !== refundedEventId);
        localStorage.setItem(`purchased_events_${address}`, JSON.stringify(updatedEvents));
        
        // Clear the session storage
        sessionStorage.removeItem('refundedEventId');
        
        // Update the tickets state immediately
        setTickets(prevTickets =>
          prevTickets.filter(ticket => ticket.eventId !== refundedEventId)
        );
        
        alert('Refund processed successfully! The ticket has been removed from your collection.');
      }
    }
  }, [isRefundConfirmed, address]);

  // Show refund error message
  React.useEffect(() => {
    if (refundError) {
      console.error('Refund error:', refundError);
      alert(`Refund failed: ${refundError.message}`);
    }
  }, [refundError]);

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
              <div className="tickets-container">
                {filteredTickets.length > 0 ? (
                  <div className="tickets-grid">
                    {filteredTickets.map((ticket) => {
                      const ticketStatus = getTicketStatus(ticket);
                      return (
                        <div key={ticket.id} className="modern-ticket-card">
                          {/* Ticket Header with Gradient */}
                          <div className="ticket-header-modern">
                            <div className="ticket-header-content">
                              <div className="event-title-section">
                                <h2 className="event-title">{ticket.eventName}</h2>
                                <div className={`status-badge ${ticketStatus.className}`}>
                                  <span className="status-dot"></span>
                                  {ticketStatus.status}
                                </div>
                              </div>
                              <div className="ticket-id-section">
                                <span className="ticket-label">TICKET</span>
                                <span className="ticket-number">#{ticket.tokenId}</span>
                              </div>
                            </div>
                          </div>

                          {/* Main Ticket Body */}
                          <div className="ticket-body">
                            <div className="ticket-info-grid">
                              <div className="info-card">
                                <div className="info-icon">📅</div>
                                <div className="info-content">
                                  <span className="info-label">Date</span>
                                  <span className="info-value">
                                    {new Date(ticket.eventDate).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>

                              <div className="info-card">
                                <div className="info-icon">🕒</div>
                                <div className="info-content">
                                  <span className="info-label">Time</span>
                                  <span className="info-value">{ticket.eventTime}</span>
                                </div>
                              </div>

                              <div className="info-card">
                                <div className="info-icon">📍</div>
                                <div className="info-content">
                                  <span className="info-label">Venue</span>
                                  <span className="info-value">{ticket.eventLocation}</span>
                                </div>
                              </div>

                              <div className="info-card">
                                <div className="info-icon">{ticket.isFree ? "🎁" : "💰"}</div>
                                <div className="info-content">
                                  <span className="info-label">Price</span>
                                  <span className="info-value">
                                    {ticket.isFree ? "FREE" : `${ticket.ticketPrice} wei`}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Purchase Info */}
                            <div className="purchase-info">
                              <div className="purchase-date">
                                <span className="purchase-label">Purchased on</span>
                                <span className="purchase-value">
                                  {new Date(ticket.purchaseDate).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Ticket Actions */}
                          <div className="ticket-actions-modern">
                            {!ticket.isEventCancelled && !ticket.isEventCompleted && (
                              <button className="action-btn primary-btn">
                                <span className="btn-icon">👁️</span>
                                View Details
                              </button>
                            )}
                            
                            {ticket.isEventCancelled && (
                              <button
                                className="action-btn refund-btn"
                                onClick={() => handleRefund(ticket.eventId)}
                                disabled={isRefundPending || isRefundConfirming}
                              >
                                <span className="btn-icon">💸</span>
                                {isRefundPending || isRefundConfirming ? 'Processing...' : 'Get Refund'}
                              </button>
                            )}
                            
                            <button className="action-btn secondary-btn">
                              <span className="btn-icon">📱</span>
                              Show QR Code
                            </button>
                          </div>

                          {/* Decorative Elements */}
                          <div className="ticket-decoration">
                            <div className="perforation-line">
                              {Array.from({ length: 20 }, (_, i) => (
                                <div key={i} className="perforation-dot"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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