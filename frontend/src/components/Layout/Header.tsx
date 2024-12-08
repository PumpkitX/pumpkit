import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import WalletWrapper from "../WalletWrapper";

export default function Header() {
  return (
    <header className="bg-background-light border-b border-primary/20 px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Rocket className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Pumpkit
          </span>
        </Link>

        <WalletWrapper className="" />
      </div>
    </header>
  );
}
