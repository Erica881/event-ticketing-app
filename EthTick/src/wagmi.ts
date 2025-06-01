import { getDefaultConfig } from "@rainbow-me/rainbowkit";

import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  // sepolia,
  scrollSepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    arbitrum,
    base,
    mainnet,
    polygon,
    scrollSepolia,
    optimism,
    // sepolia,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
    //   ? [scrollSepolia]
    //   : []),
  ],
  ssr: true,
});
