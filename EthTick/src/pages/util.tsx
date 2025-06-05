import { nftTicAbi } from "../abi/NFTTic";
import { useReadContract } from "wagmi";

export const contractInfo = {
  address: "0x1398e2ae6CD065F2aA69Ae8b9E538EA32Faa3E11",
  abi: nftTicAbi,
};

export const readCreatedEventByOrganisor = (organisorAddress: string) => ({
  abi: nftTicAbi,
  address: contractInfo.address as `0x${string}`,
  functionName: "getEventsByOrganizer",
  args: [organisorAddress],
});

// Helper function to check tickets bought by user for a specific event
export const getTicketsBoughtByUser = (eventId: number, userAddress: string) => ({
  abi: nftTicAbi,
  address: contractInfo.address as `0x${string}`,
  functionName: "ticketsBought",
  args: [eventId, userAddress],
});

// Helper function to get escrow balance for an event
export const getEventEscrowBalance = (eventId: number) => ({
  abi: nftTicAbi,
  address: contractInfo.address as `0x${string}`,
  functionName: "getEscrowBalance",
  args: [eventId],
});
