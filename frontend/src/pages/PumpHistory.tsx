import { motion } from "framer-motion";
import WalletPrompt from "../components/WalletPrompt";
import { useWalletClient } from "wagmi";

const MOCK_PUMPED_TOKENS = [
  {
    symbol: "BNA",
    name: "Banana",
    balance: "991230",
    address: "0xa16302dBFD70c65a25E797ae41B3306E6E102eaF",
    postsCount: 2,
    interactions: 321,
    remainingFunds: "2610",
  },
];

export default function PumpHistory() {
  const { data } = useWalletClient();

  if (!data?.account) {
    return <WalletPrompt />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Your pumps</h2>

      <div className="space-y-4">
        {MOCK_PUMPED_TOKENS.map((token) => (
          <div
            key={token.symbol}
            className="bg-background-light border border-primary/20 rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{token.symbol}</h3>
                <p className="text-gray-400">{token.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Remaining Funds</p>
                <p className="text-lg font-semibold">
                  {token.remainingFunds} {token.symbol}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-background p-4 rounded-lg">
                <p className="text-sm text-gray-400">Posts Made</p>
                <p className="text-2xl font-bold">{token.postsCount}</p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Interactions</p>
                <p className="text-2xl font-bold">{token.interactions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
