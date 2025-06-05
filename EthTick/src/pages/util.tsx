import { nftTicAbi } from "../abi/NFTTic";
import { useReadContract } from "wagmi";

export const contractInfo = {
  address: "0x1398e2ae6CD065F2aA69Ae8b9E538EA32Faa3E11",
  abi: nftTicAbi,
};

export const readCreatedEventByOrganisor = (organisorAddress: string) => ({
  abi: nftTicAbi,
  address: contractInfo.address as `0x${string}`,
  functionName: "getAllEvents",
  args: [organisorAddress],
});
