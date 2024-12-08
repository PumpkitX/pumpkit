"use client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { baseSepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { useWagmiConfig } from "./wagmi";
import logo from "../assets/icon.jpeg";

type Props = { children: ReactNode };

const queryClient = new QueryClient();

function OnchainProviders({ children }: Props) {
  const wagmiConfig = useWagmiConfig();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              name: "Pumpkit", // Displayed in modal header
              logo: logo, // Displayed in modal header
              mode: "dark", // 'light' | 'dark' | 'auto'
              theme: "default", // 'default' or custom theme
            },
            wallet: {
              display: "modal",
              //   termsUrl: "https://...",
              //   privacyUrl: "https://...",
            },
          }}
        >
          <RainbowKitProvider modalSize="compact">
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
