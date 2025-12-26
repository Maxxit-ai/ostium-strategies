"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { arbitrum, arbitrumSepolia } from "viem/chains";
// import logo from "@/assets/images/icon.svg";
// import { PrivyAuthHandler } from "./PrivyAuthHandler";
// import { SessionProvider } from "next-auth/react";
import { getOstiumConfig } from "@/app/lib/ostium-config";

interface Web3ProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
}

export default function Provider({ children }: Web3ProviderProps) {
  // Get Ostium config to determine default chain
  const ostiumConfig = getOstiumConfig();
  const isMainnet = ostiumConfig.chainId === 42161;
  const defaultChain = isMainnet ? arbitrum : arbitrumSepolia;


  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          }
        },
        loginMethods: ["wallet"],
        appearance: {
          showWalletLoginFirst: true,
          theme: "dark",
          accentColor: "#FF5A19", // Ostium primary color
        },
        defaultChain,
        supportedChains: [arbitrum, arbitrumSepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}