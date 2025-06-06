import { nftTicAbi } from "../abi/NFTTic";
import { useReadContract } from "wagmi";

export const contractInfo = {
  address: "0x067ccc8ab719f39eE56A4cdde9832fA116408358",
  abi: nftTicAbi,
};

export const readCreatedEventByOrganisor = (organisorAddress: string) => ({
  abi: nftTicAbi,
  address: contractInfo.address as `0x${string}`,
  functionName: "getEventsByOrganizer",
  args: [organisorAddress],
});

// Helper function to check tickets bought by user for a specific event
export const getTicketsBoughtByUser = (
  eventId: number,
  userAddress: string
) => ({
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
