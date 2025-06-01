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

import { useState } from "react";

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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 max-w-lg mx-auto bg-white rounded-xl shadow"
    >
      <h2 className="text-2xl font-bold text-center">Create Event</h2>

      <input
        type="text"
        name="name"
        placeholder="Event Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="description"
        placeholder="Event Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isFree"
          checked={formData.isFree}
          onChange={handleChange}
        />
        <label>Is this event free?</label>
      </div>

      <input
        type="number"
        name="cost"
        placeholder="Ticket Price (ETH)"
        value={formData.cost}
        onChange={handleChange}
        disabled={formData.isFree}
        required={!formData.isFree}
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        name="maxTickets"
        placeholder="Max Tickets"
        value={formData.maxTickets}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Create Event
      </button>
    </form>
  );
}
