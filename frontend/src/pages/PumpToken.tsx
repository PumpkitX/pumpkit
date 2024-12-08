import React, { useCallback } from "react";
import { motion } from "framer-motion";
import WalletPrompt from "../components/WalletPrompt";
import { useWalletClient } from "wagmi";
// import { Loader2Icon } from "lucide-react";
import useWalletBalances from "../lib/useWalletBalances";
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction";
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { baseSepolia } from "viem/chains";

const KNOWN_TOKENS = [
  "0xa16302dBFD70c65a25E797ae41B3306E6E102eaF",
  "0x87C51CD469A0E1E2aF0e0e597fD88D9Ae4BaA967",
  "0xa8cB1964ea7f9674Ac6EC2Bc87D386380bE264F8",
  "0x5878e492fba20F47884841d093b79d259B5B799B",
  // Add more token addresses
];

const MOCK_TOKENS = [
  {
    symbol: "BNA",
    name: "Banana",
    balance: "9999950",
    address: KNOWN_TOKENS[0],
  },
  {
    symbol: "TEA",
    name: "TEA Token",
    balance: "101312",
    address: KNOWN_TOKENS[1],
  },
  {
    symbol: "stTEA",
    name: "Staked Tea Token",
    balance: "314",
    address: KNOWN_TOKENS[2],
  },
  {
    symbol: "BP",
    name: "Black Pass Token",
    balance: "91",
    address: KNOWN_TOKENS[3],
  },
];

const AI_WALLET_ADDRESS = "0x9e4B1e417a02F5a56fcdC13872355290f1DaE856";

export default function PumpToken() {
  const { data } = useWalletClient();

  useWalletBalances();

  const [selectedToken, setSelectedToken] = React.useState("");
  const [amount, setAmount] = React.useState("");
  // const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 5000);
  };

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log("LifecycleStatus", status);
  }, []);
  const clickContractAddress = "0x67c97D1FB8184F038592b2109F854dfb09C77C75";
  const clickContractAbi = [
    {
      type: "function",
      name: "click",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
  ] as const;

  const calls = [
    {
      address: clickContractAddress,
      abi: clickContractAbi,
      functionName: "click",
      args: [],
    },
  ];

  if (!data?.account) {
    return <WalletPrompt />;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6">Pump your token</h2>

      <form onSubmit={handleSubmit} className="space-y-6 mb-10">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Select Token
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full bg-background-light border border-primary/20 rounded-lg p-3 text-white"
          >
            <option value="">Select a token</option>
            {MOCK_TOKENS.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol} - Balance: {token.balance}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-background-light border border-primary/20 rounded-lg p-3 text-white"
            placeholder="Enter amount"
          />
        </div>

        <div className="bg-background-light border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-gray-400">AI Agent Wallet Address:</p>
          <p className="font-mono">{AI_WALLET_ADDRESS}</p>
        </div>

        {/* <button
          type="submit"
          className="w-full overflow-hidden relative bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-all"
          disabled={loading}
        >
          {loading ? (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin">
                <Loader2Icon />
              </div>
            </div>
          ) : null}
          Start Pump
        </button> */}
      </form>

      <Transaction
        chainId={baseSepolia.id}
        calls={calls}
        onStatus={handleOnStatus}
      >
        <TransactionButton />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
      <div className="text-center">Pump 🚀🚀🚀</div>
    </motion.div>
  );
}
