"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PrivyClientConfig } from "@privy-io/react-auth";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import {
  mainnet,
  optimism,
  arbitrum,
  arbitrumSepolia,
  optimismSepolia,
} from "viem/chains";
// import logo from "@/assets/images/icon.svg";
// import { PrivyAuthHandler } from "./PrivyAuthHandler";
// import { SessionProvider } from "next-auth/react";
import { getOstiumConfig } from "@/app/lib/ostium-config";

interface Web3ProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
}

// Wagmi configuration
const wagmiConfig = createConfig({
  chains: [optimism, arbitrum, arbitrumSepolia, optimismSepolia, mainnet],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
    [optimismSepolia.id]: http(),
  },
});

// Get Ostium config to determine default chain
const ostiumConfig = getOstiumConfig();
const isMainnet = ostiumConfig.chainId === 42161;
const defaultChain = isMainnet ? arbitrum : arbitrumSepolia;

// Privy configuration
const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets",
    },
  },
  loginMethods: ["wallet", "github"],
  appearance: {
    showWalletLoginFirst: true,
    theme: "dark",
    accentColor: "#FF5A19", // Ostium primary color
  },
  defaultChain,
};

const queryClient = new QueryClient();

export default function Provider({ children }: Web3ProviderProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        {/* <PrivyAuthHandler /> */}
        {/* <SessionProvider> */}
        <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
          {children}
        </WagmiProvider>
        {/* </SessionProvider> */}
      </QueryClientProvider>
    </PrivyProvider>
  );
}