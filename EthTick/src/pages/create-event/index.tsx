"use client";
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
// import { parseEther } from "viem";
import Navbar from "../Navbar";
import { contractInfo } from "../../pages/util"; // Importing contract info from util.ts
import Link from "next/link";

// const CONTRACT_ADDRESS = "0xc753037F5C01FfA0864aaf499C93D6Fa221613C3"; // Replace with actual deployed contract address
// const CONTRACT_ADDRESS = "0x77DAfbB17F8BB50ae33FFc5a84bfDb34b097ae11";
// const CONTRACT_ADDRESS = "0x1a9e96c1d5de74b0b0a60834237dd90ff842130a"; // Replace with actual deployed contract address
const CONTRACT_ADDRESS = contractInfo.address; // Use the address from util.ts
const ABI = contractInfo.abi; // Use the ABI from util.ts

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
        abi: ABI,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "list",
        args: [
          form.name,
          Number(form.cost || "0"),
          Number(form.maxTickets),
          form.date,
          form.time,
          form.location,
          form.imageUrl || "", // Optional image URL
          form.description,
          Number(form.cost) === 0, // isFree
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
          <h1>Event Created</h1>
        </div>
      </div>

      <div className="navbar-logo">
        <Link href="/create-event/create-event-form">Create Event</Link>
      </div>
    </>
  );
}
