import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

export default function WalletPrompt() {
  const connect = () => {
    try {
      (
        document
          .getElementById("wallet-component")
          ?.getElementsByTagName("button")[0] as HTMLElement
      ).click();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-[60vh]"
    >
      <div className="bg-background-light p-8 rounded-xl border border-primary/20 text-center max-w-md">
        <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-6">
          <Wallet className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-6">
          Please connect your wallet to access your tokens and start pumping!
        </p>

        <button
          onClick={connect}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-all w-full"
        >
          Connect Wallet
        </button>
      </div>
    </motion.div>
  );
}
