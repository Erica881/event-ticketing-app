"use client";

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../wagmi";

// const projectId = "YOUR_PROJECT_ID"; // Get this from WalletConnect Cloud

// const { wallets } = getDefaultWallets({
//   appName: "Event Ticketing",
//   projectId,
// });

// const config = createConfig({
//   chains: [mainnet, sepolia],
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//   },
// });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce aggressive refetching
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      // Add staleTime to prevent unnecessary network requests
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Increase cache time
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      // Reduce retry attempts
      retry: 1,
      // Increase retry delay
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
