import { nftTicAbi } from "../abi/NFTTic";
import { useReadContract } from "wagmi";

export const contractInfo = {
  address: "0x06f0b47f6bE1631e542667cf05F3478e2F6FBCa2",
  abi: nftTicAbi,
};

export const readCreatedEventByOrganisor = (organisorAddress: string) => ({
  abi: nftTicAbi,
  address: contractInfo.address as `0x${string}`,
  functionName: "getAllEvents",
  args: [organisorAddress],
});
