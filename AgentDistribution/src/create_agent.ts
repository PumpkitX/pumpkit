import { ethers } from "ethers";

const createAgentRandomWallet = async () => {
  try {
    const wallet = ethers.Wallet.createRandom().connect(
      new ethers.providers.JsonRpcProvider("https://sepolia.base.org")
    );
    console.log(wallet.privateKey);
  } catch (e) {
    console.error(e);
  }
};

createAgentRandomWallet();
