"use client";
import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import Navbar from "../Navbar";
import Link from "next/link";
import { Event } from "../../interfaces";
import { contractInfo } from "../util";

// Blockchain Event structure from contract
interface BlockchainEvent {
  id: bigint;
  name: string;
  date: string;
  time: string;
  location: string;
  desc: string;
  cost: bigint;
  maxTickets: bigint;
  isFree: boolean;
  imageUrl: string;
  isCompleted: boolean;
  isCancelled: boolean;
  organizer: string;
}

// Extended interface for created events with additional blockchain data
interface CreatedEvent extends Event {
  ticketsSold: number;
  escrowBalance: number;
  isCompleted: boolean;
  isCancelled: boolean;
  transactionHash?: string;
}

export default function CreateEvent() {
  const { address, isConnected } = useAccount();
  const { data: hash, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events created by the connected organizer
  const { data: blockchainEvents, isError, isLoading: isLoadingEvents } = useReadContract({
    abi: contractInfo.abi,
    address: contractInfo.address as `0x${string}`,
    functionName: "getEventsByOrganizer",
    args: [address],
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Convert blockchain events to our format and fetch additional data
  useEffect(() => {
    const processEvents = async () => {
      if (!blockchainEvents || !Array.isArray(blockchainEvents)) {
        setCreatedEvents([]);
        return;
      }

      setIsLoading(true);
      try {
        const processedEvents: CreatedEvent[] = [];

        for (const event of blockchainEvents as BlockchainEvent[]) {
          // For now, we'll use placeholder data for tickets sold and escrow balance
          // In a real implementation, you would fetch this from the contract
          const ticketsSold = 0; // This would come from contract data
          const escrowBalance = Number(event.cost) * ticketsSold;

          const processedEvent: CreatedEvent = {
            id: event.id.toString(),
            name: event.name,
            date: event.date,
            time: event.time,
            location: event.location,
            description: event.desc,
            price: Number(event.cost),
            maxTickets: Number(event.maxTickets),
            isFree: event.isFree,
            imageUrl: event.imageUrl,
            ticketsSold,
            escrowBalance,
            isCompleted: event.isCompleted,
            isCancelled: event.isCancelled,
          };

          processedEvents.push(processedEvent);
        }

        setCreatedEvents(processedEvents);
      } catch (error) {
        console.error("Error processing events:", error);
        setCreatedEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    processEvents();
  }, [blockchainEvents]);

  const handleCompleteEvent = async (eventId: string) => {
    try {
      if (!writeContractAsync) {
        console.error("Contract write function is not available.");
        return;
      }

      console.log("Completing event:", eventId);
      
      const tx = await writeContractAsync({
        abi: contractInfo.abi,
        address: contractInfo.address as `0x${string}`,
        functionName: "completeEvent",
        args: [BigInt(eventId)],
      });

      console.log("Transaction sent:", tx);
      
      // Update local state optimistically
      setCreatedEvents(prev =>
        prev.map(event =>
          event.id === eventId
            ? { ...event, isCompleted: true, transactionHash: tx }
            : event
        )
      );
    } catch (error: any) {
      console.error("Complete event failed:", error);
      
      // Extract revert reason if available
      if (error?.cause?.reason) {
        console.error("Contract revert reason:", error.cause.reason);
      }
      if (error?.reason) {
        console.error("Transaction revert reason:", error.reason);
      }
      if (error?.message) {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleCancelEvent = async (eventId: string) => {
    try {
      if (!writeContractAsync) {
        console.error("Contract write function is not available.");
        return;
      }


      console.log("Cancelling event:", eventId);
      console.log("Event ID as BigInt:", BigInt(eventId));
      
      const tx = await writeContractAsync({
        abi: contractInfo.abi,
        address: contractInfo.address as `0x${string}`,
        functionName: "cancelEvent",
        args: [BigInt(eventId)],

      });

      console.log("Transaction sent successfully:", tx);
      
      // Update local state optimistically
      setCreatedEvents(prev =>
        prev.map(event =>
          event.id === eventId
            ? { ...event, isCancelled: true, transactionHash: tx }
            : event
        )
      );
      
      console.log("UI updated - event should now show as cancelled");
      
    } catch (error: any) {
      console.error("Cancel event failed:", error);
      
      // Extract revert reason if available
      if (error?.cause?.reason) {
        console.error("Contract revert reason:", error.cause.reason);
      }
      if (error?.reason) {
        console.error("Transaction revert reason:", error.reason);
      }
      if (error?.message) {
        console.error("Error message:", error.message);
      }
      
      // Log the full error object to see all available information
      console.error("Full error object:", JSON.stringify(error, null, 2));
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Header Section */}
        <div className="create-event-header">
          <div className="header-top">
            {isConnected && address && (
              <div className="wallet-address-display">
                Wallet address: {formatAddress(address)}
              </div>
            )}
          </div>
        </div>

        {/* Created Events Section */}
        <div className="created-events-section">
          <div className="section-header">
            <h2>Created Event</h2>
            <Link href="/create-event/create-event-form" className="create-another-btn">
              Create Another Event
            </Link>
          </div>

          {/* Loading State */}
          {(isLoadingEvents || isLoading) && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your events...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="error-state">
              <p>Failed to load events. Please try again.</p>
            </div>
          )}

          {/* Events List */}
          <div className="created-events-list">
            {!isLoadingEvents && !isLoading && createdEvents.map((event) => (
              <div key={event.id} className="created-event-card">
                <div className="event-card-header">
                  <h3>{event.name}</h3>
                </div>
                
                <div className="event-card-content">
                  <div className="event-description-box">
                    <textarea 
                      value={event.description}
                      readOnly
                      className="event-description-textarea"
                    />
                  </div>
                  
                  <div className="event-stats">
                    <div className="stat-item">
                      <span className="stat-label">Tic Price:</span>
                      <span className="stat-value">
                        {(event.isFree || event.price === 0) ? "Free Entry" : `${event.price} wei`}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Sold:</span>
                      <span className="stat-value">{event.ticketsSold} ticket(s)</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Escrow Balance:</span>
                      <span className="stat-value">{event.escrowBalance} wei</span>
                    </div>
                  </div>
                </div>

                <div className="event-actions">
                  {!event.isCompleted && !event.isCancelled && (
                    <>
                      <button
                        className="action-btn complete-btn"
                        onClick={() => handleCompleteEvent(event.id)}
                      >
                        Complete Event
                      </button>
                      <button
                        className="action-btn cancel-btn"
                        onClick={() => handleCancelEvent(event.id)}
                      >
                        Cancel Event
                      </button>
                    </>
                  )}
                  
                  {event.isCompleted && (
                    <div className="event-status-section">
                      <div className="status-badge completed">
                        Event Completed
                      </div>
                      {event.transactionHash && (
                        <div className="transaction-success">
                          <div className="success-indicator">
                            <span className="success-icon">✓</span>
                            <span>Transaction Success</span>
                          </div>
                          <div className="transaction-note">
                            Include the transaction hash and direct link to check the transaction
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {event.isCancelled && (
                    <div className="status-badge cancelled">
                      Event Cancelled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isLoadingEvents && !isLoading && !isError && createdEvents.length === 0 && (
            <div className="no-events">
              <div className="no-events-icon">🎫</div>
              <p>You haven't created any events yet.</p>
              <Link href="/create-event/create-event-form" className="create-first-event-btn">
                Create Your First Event
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
