import React, { useState } from "react";
import { Event } from "../../interfaces";
import { useRouter } from "next/router"; // Using next/router
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { contractInfo } from "../util";

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  // Removed quantity state - users can only buy 1 ticket at a time
  const [isLoading, setIsLoading] = useState(false);

  // Wagmi hooks for contract interaction
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleBuyClick = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first!");
      return;
    }

    // Check if event is cancelled
    if (event.isCancelled) {
      alert(
        "This event has been cancelled and tickets are no longer available for purchase."
      );
      return;
    }

    // Check if event is completed
    if (event.isCompleted) {
      alert(
        "This event has been completed and tickets are no longer available for purchase."
      );
      return;
    }

    // Validate event data
    if (!event.id || isNaN(Number(event.id))) {
      alert("Invalid event ID. Please refresh the page and try again.");
      return;
    }

    try {
      setIsLoading(true);

      // Users can only buy 1 ticket at a time
      // const ticketQuantity = 1;
      const totalCost = BigInt(event.price);

      console.log("Purchasing tickets:", {
        eventId: event.id,
        eventIdAsNumber: Number(event.id),
        quantity: 1,
        totalCost: totalCost.toString(),
        isFree: event.isFree || event.price === 0,
        contractAddress: contractInfo.address,
      });

      // Check if tickets are still available
      if (event.maxTickets <= 0) {
        alert(`This event is sold out.`);
        setIsLoading(false);
        return;
      }

      // Call the mint function from the smart contract
      await writeContract({
        address: contractInfo.address as `0x${string}`,
        abi: contractInfo.abi,
        functionName: "mint",
        args: [BigInt(event.id), BigInt(1)],
        value: totalCost,
      });
    } catch (err) {
      console.error("Transaction failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      // Provide more specific error messages
      if (errorMessage.includes("Invalid event ID")) {
        alert(
          "This event does not exist in the smart contract. Please refresh and try again."
        );
      } else if (errorMessage.includes("Not enough tickets")) {
        alert("Not enough tickets available for this event.");
      } else if (errorMessage.includes("Please pay exact amount")) {
        alert("Payment amount is incorrect. Please try again.");
      } else if (errorMessage.includes("Event was cancelled")) {
        alert("This event has been cancelled.");
      } else {
        alert(`Transaction failed: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message when transaction is confirmed
  React.useEffect(() => {
    if (isConfirmed && address) {
      const message =
        event.isFree || event.price === 0
          ? `Successfully registered for ${event.name}!`
          : `Successfully purchased 1 ticket for ${event.name}!`;

      // Track the purchase in localStorage for My Tickets page
      const purchasedEvents = JSON.parse(
        localStorage.getItem(`purchased_events_${address}`) || "[]"
      );
      if (!purchasedEvents.includes(event.id)) {
        purchasedEvents.push(event.id);
        localStorage.setItem(
          `purchased_events_${address}`,
          JSON.stringify(purchasedEvents)
        );
      }

      alert(message);
    }
  }, [isConfirmed, event.name, event.isFree, event.price, event.id, address]);

  // Show error message if transaction fails
  React.useEffect(() => {
    if (error) {
      console.error("Contract error:", error);
      alert(`Transaction failed: ${error.message}`);
    }
  }, [error]);

  // Check if event is sold out (maxTickets represents remaining tickets from smart contract)
  const isSoldOut = event.maxTickets <= 0;
  const isCancelled = event.isCancelled || false;
  const isCompleted = event.isCompleted || false;

  const imageUrl =
    event.imageUrl ||
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  return (
    <div
      className={`event-item ${isCancelled ? "cancelled-event" : ""} ${
        isCompleted ? "completed-event" : ""
      }`}
    >
      <div className="event-image-container">
        <img src={imageUrl} alt={event.name} className="event-image" />
        <div className="event-date-badge">
          {new Date(event.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
        {isCancelled && <div className="cancelled-badge">❌ CANCELLED</div>}
        {isCompleted && !isCancelled && (
          <div className="completed-badge">✅ COMPLETED</div>
        )}
      </div>

      <div className="event-content">
        <h3>{event.name}</h3>
        <p className="event-time">
          <i className="event-icon">🕒</i>{" "}
          {new Date(event.date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="event-location">
          <i className="event-icon">📍</i> {event.location}
        </p>
        <p className="event-price">
          <i className="event-icon">
            {event.isFree || event.price === 0 ? "🎁" : "💰"}
          </i>
          {event.isFree || event.price === 0
            ? "Free Entry"
            : `${event.price} wei`}
        </p>
        <p className="event-description">{event.description}</p>

        {/* Show ticket availability status */}
        <div className="ticket-availability">
          {isCancelled ? (
            <p className="cancelled-notice">❌ Event Cancelled</p>
          ) : isCompleted ? (
            <p className="completed-notice">✅ Event Completed</p>
          ) : isSoldOut ? (
            <p className="sold-out-notice">🚫 Sold Out</p>
          ) : event.maxTickets ? (
            <p className="tickets-remaining">
              🎫 {event.maxTickets} tickets remaining
            </p>
          ) : null}
        </div>
      </div>

      <button
        className={`buy-button ${isSoldOut ? "sold-out" : ""} ${
          isCancelled ? "cancelled" : ""
        } ${isCompleted ? "completed" : ""}`}
        onClick={handleBuyClick}
        disabled={
          isLoading ||
          isPending ||
          isConfirming ||
          !isConnected ||
          isSoldOut ||
          isCancelled ||
          isCompleted
        }
      >
        {!isConnected
          ? "Connect Wallet"
          : isCancelled
          ? "Event Cancelled"
          : isCompleted
          ? "Event Completed"
          : isSoldOut
          ? "Sold Out"
          : isLoading || isPending
          ? "Confirming Transaction..."
          : isConfirming
          ? "Processing..."
          : event.isFree || event.price === 0
          ? "Register Now"
          : `Purchase Ticket • ${event.price} wei`}
      </button>
    </div>
  );
};

export default EventItem;
