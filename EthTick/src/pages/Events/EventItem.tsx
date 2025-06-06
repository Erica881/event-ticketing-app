import React, { useState } from "react";
import { Event } from "../../interfaces";
// import { useAuth } from "../../contexts/AuthContext"; // Assuming similar context or hook
import { useRouter } from "next/router"; // Using next/router
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { contractInfo } from "../util";
import { parseEther } from "viem";

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  // const { isAuthenticated } = useAuth(); // Placeholder for auth
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
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

    // Validate event data
    if (!event.id || isNaN(Number(event.id))) {
      alert("Invalid event ID. Please refresh the page and try again.");
      return;
    }

    try {
      setIsLoading(true);

      // For free events, set quantity to 1 and cost to 0
      const ticketQuantity = event.isFree || event.price === 0 ? 1 : quantity;
      const totalCost = BigInt(event.price) * BigInt(ticketQuantity);

      console.log("Purchasing tickets:", {
        eventId: event.id,
        eventIdAsNumber: Number(event.id),
        quantity: ticketQuantity,
        totalCost: totalCost.toString(),
        isFree: event.isFree || event.price === 0,
        contractAddress: contractInfo.address,
      });

      // Validate that we have enough tickets available
      if (event.maxTickets && event.maxTickets < ticketQuantity) {
        alert(`Only ${event.maxTickets} tickets available for this event.`);
        setIsLoading(false);
        return;
      }

      // Call the mint function from the smart contract
      await writeContract({
        address: contractInfo.address as `0x${string}`,
        abi: contractInfo.abi,
        functionName: "mint",
        args: [BigInt(event.id), BigInt(ticketQuantity)],
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
      const ticketQuantity = event.isFree || event.price === 0 ? 1 : quantity;
      const message =
        event.isFree || event.price === 0
          ? `Successfully registered for ${event.name}!`
          : `Successfully purchased ${ticketQuantity} ticket${
              ticketQuantity > 1 ? "s" : ""
            } for ${event.name}!`;

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
  }, [
    isConfirmed,
    quantity,
    event.name,
    event.isFree,
    event.price,
    event.id,
    address,
  ]);

  // Show error message if transaction fails
  React.useEffect(() => {
    if (error) {
      console.error("Contract error:", error);
      alert(`Transaction failed: ${error.message}`);
    }
  }, [error]);

  // const handleQuantityChange = (change: number) => {
  //   const newQuantity = quantity + change;
  //   if (newQuantity >= 1 && newQuantity <= 10) {
  //     // Max 10 tickets
  //     setQuantity(newQuantity);
  //   }
  // };

  const imageUrl =
    event.imageUrl ||
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  return (
    <div className="event-item">
      <div className="event-image-container">
        <img src={imageUrl} alt={event.name} className="event-image" />
        <div className="event-date-badge">
          {new Date(event.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
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
      </div>

      <button
        className="buy-button"
        onClick={handleBuyClick}
        disabled={isLoading || isPending || isConfirming || !isConnected}
      >
        {!isConnected
          ? "Connect Wallet"
          : isLoading || isPending
          ? "Confirming Transaction..."
          : isConfirming
          ? "Processing..."
          : event.isFree || event.price === 0
          ? "Register Now"
          : `Purchase Ticket${quantity > 1 ? "s" : ""} • ${
              event.price * quantity
            } wei`}
      </button>
    </div>
  );
};

export default EventItem;
