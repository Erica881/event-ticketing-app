// import { useState } from "react";
// import { useAccount, useWriteContract } from "wagmi";
// import { parseEther } from "viem";
// import { NFTTicAbi } from "../../abi/NFTTic"; // You must provide the ABI file

// const CONTRACT_ADDRESS = "0xc753037F5C01FfA0864aaf499C93D6Fa221613C3"; // Replace with actual deployed contract address

// export default function CreateEvent() {
//   const { address, isConnected } = useAccount();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     cost: "",
//     maxTickets: "",
//     date: "",
//     time: "",
//     location: "",
//   });

//   const { config } = useWriteContract({
//     address: CONTRACT_ADDRESS,
//     abi,
//     functionName: "list",
//     args: [
//       form.name,
//       form.description,
//       parseEther(form.cost || "0"),
//       Number(form.maxTickets),
//       form.date,
//       form.time,
//       form.location,
//     ],
//     enabled: isConnected && !!form.name && !!form.maxTickets,
//   });

//   const { write, isLoading, isSuccess } = useContractWrite(config);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     write?.();
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Create Event</h2>
//       <form onSubmit={handleSubmit} className="grid gap-4">
//         {[
//           ["name", "Event Name"],
//           ["description", "Description"],
//           ["cost", "Ticket Price (ETH)", "number"],
//           ["maxTickets", "Max Tickets", "number"],
//           ["date", "Date"],
//           ["time", "Time"],
//           ["location", "Location"],
//         ].map(([name, label, type = "text"]) => (
//           <input
//             key={name}
//             name={name}
//             type={type}
//             placeholder={label}
//             value={form[name]}
//             onChange={handleChange}
//             className="border px-3 py-2 rounded"
//             required
//           />
//         ))}

//         <button
//           type="submit"
//           className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
//           disabled={!write || isLoading}
//         >
//           {isLoading ? "Creating..." : "Create Event"}
//         </button>

//         {isSuccess && (
//           <p className="text-green-600">Event created successfully!</p>
//         )}
//       </form>
//     </div>
//   );
// }

// pages/create-event.tsx

"use client";

import React, { useState } from "react";
import Navbar from "../Navbar"; // Import the Navbar component

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: "",
    maxTickets: "",
    date: "",
    time: "",
    location: "",
    isFree: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "isFree" && checked ? { cost: "" } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert cost to 0 if free
    const finalData = {
      ...formData,
      cost: formData.isFree ? "0" : formData.cost,
    };

    console.log("Event data to submit:", finalData);

    // TODO: Interact with smart contract here
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Create a New Event</h1>
          <p className="page-subtitle">
            Fill in the details below to list your event on the platform.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="create-event-form"
        >
        <label htmlFor="name">Event Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="e.g., Annual Tech Summit"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Event Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Tell us more about your event..."
          value={formData.description}
          onChange={handleChange}
          required
        />

        <div className="form-checkbox-group">
          <input
            type="checkbox"
            id="isFree"
            name="isFree"
            checked={formData.isFree}
            onChange={handleChange}
          />
          <label htmlFor="isFree" className="checkbox-label">Is this event free?</label>
        </div>

        <label htmlFor="cost">Ticket Price (ETH)</label>
        <input
          type="number"
          id="cost"
          name="cost"
          placeholder="e.g., 0.1"
          value={formData.cost}
          onChange={handleChange}
          disabled={formData.isFree}
          required={!formData.isFree}
          step="any"
        />

        <label htmlFor="maxTickets">Max Tickets</label>
        <input
          type="number"
          id="maxTickets"
          name="maxTickets"
          placeholder="e.g., 100"
          value={formData.maxTickets}
          onChange={handleChange}
          required
        />

        <label htmlFor="date">Event Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="time">Event Time</label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="e.g., Online or City Convention Center"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
        >
          Create Event
        </button>
      </form>
      </div>
    </React.Fragment>
  );
}
