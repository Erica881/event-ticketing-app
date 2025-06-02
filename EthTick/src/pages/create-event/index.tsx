"use client";
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { nftTicAbi } from "../../abi/NFTTic"; // You must provide the ABI file
import Navbar from "../Navbar";

const CONTRACT_ADDRESS = "0xc753037F5C01FfA0864aaf499C93D6Fa221613C3"; // Replace with actual deployed contract address

export default function CreateEvent() {
  const { address, isConnected } = useAccount();
  const { data: hash, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [form, setForm] = useState({
    name: "",
    description: "",
    cost: "",
    maxTickets: "",
    date: "",
    time: "",
    location: "",
    imageUrl: "",
  });

  // const { write, isLoading, isSuccess } = useContractWrite(config);
  // const { data: hash, writeContract} = useWriteContract();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // write?.();
    try {
      if (!isConnected) {
        alert("Please connect your wallet first.");
        return;
      }
      if (!writeContractAsync) {
        alert("Contract write function is not available.");
        return;
      }
      const listCreation = await writeContractAsync({
        abi: nftTicAbi,
        address: CONTRACT_ADDRESS,
        functionName: "list",
        args: [
          form.name,
          form.description,
          Number(form.cost || "0"),
          Number(form.maxTickets),
          form.date,
          form.time,
          form.location,
        ],
      });

      console.log("Transaction sent:", listCreation);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Create New Event</h1>
          <p className="page-subtitle">
            Fill in the details below to create your event and start selling tickets on the blockchain
          </p>
        </div>

        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <form onSubmit={handleSubmit} className="create-event-form">
            <div className="form-grid">
              {/* Event Name */}
              <div className="form-group">
                <label htmlFor="name">Event Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter event name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              {/* Image URL */}
              <div className="form-group">
                <label htmlFor="imageUrl">Event Image URL</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={handleChange}
                />
                {form.imageUrl && (
                  <div className="image-preview-url">
                    <img src={form.imageUrl} alt="Event preview" onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }} />
                  </div>
                )}
              </div>

              {/* Cost, Max Tickets, and Date Row */}
              <div className="form-row-three">
                <div className="form-group">
                  <label htmlFor="cost">Ticket Price (ETH) *</label>
                  <input
                    id="cost"
                    name="cost"
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.01"
                    value={form.cost}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="maxTickets">Max Tickets *</label>
                  <input
                    id="maxTickets"
                    name="maxTickets"
                    type="number"
                    min="1"
                    placeholder="100"
                    value={form.maxTickets}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Event Date *</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Time and Location Row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="time">Event Time *</label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Enter event location"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Wallet Connection Warning */}
            {!isConnected && (
              <div className="wallet-warning">
                <span>⚠️</span>
                <p>Please connect your wallet to create an event</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="create-event-btn"
              disabled={isConfirmed || isConfirming || !isConnected}
            >
              {isConfirming ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Event...
                </>
              ) : (
                <>
                  <span>🎫</span>
                  Create Event
                </>
              )}
            </button>

            {/* Success Message */}
            {isConfirmed && (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h3>Event Created Successfully!</h3>
                <p>Your event has been created on the blockchain.</p>
                {hash && (
                  <div className="transaction-hash">
                    <small>Transaction Hash:</small>
                    <code>{hash}</code>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
