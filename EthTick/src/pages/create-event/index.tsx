"use client";
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { nftTicAbi } from "../../abi/NFTTic"; // You must provide the ABI file

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
    inputImage: "",
  });

  // const { write, isLoading, isSuccess } = useContractWrite(config);
  // const { data: hash, writeContract} = useWriteContract();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev: any) => ({
      ...prev,
      image: file,
    }));
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
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {(
          [
            ["name", "Event Name"],
            ["description", "Description"],
            ["cost", "Ticket Price (ETH)", "number"],
            ["maxTickets", "Max Tickets", "number"],
            ["date", "Date"],
            ["time", "Time"],
            ["location", "Location"],
          ] as [keyof typeof form, string, string?][]
        ).map(([name, label, type = "text"]) => (
          <input
            key={name}
            name={name}
            type={type}
            placeholder={label}
            value={form[name]}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
        ))}
        {/* <label htmlFor="image">Event Image (Poster or Banner)</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        /> */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={isConfirmed || isConfirming || !isConnected}
        >
          {isConfirming ? "Creating..." : "Create Event"}
        </button>

        {isConfirmed && (
          <>
            {hash && <div>Transaction Hash: {hash}</div>}
            <p className="text-green-600">Event created successfully!</p>
          </>
        )}
      </form>
    </div>
  );
}
