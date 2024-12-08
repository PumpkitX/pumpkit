import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

let coinbase = Coinbase.configureFromJson({
  filePath: "~/Downloads/cdp_api_key.json",
});

const createKOLAgent = async () => {
  let wallet = await Wallet.create();
  console.log(`Wallet successfully created: `, wallet.toString());

  let address = await wallet.getDefaultAddress();
  console.log(`Default address: `, address.toString());
};

const walletToDistribute = ["0x123", "0x456", "0x789"];

const distributeWallets = async () => {
  let wallet = await Wallet.create();
  const distributionAmount = 120;

  const singleDistributionAmount =
    distributionAmount / walletToDistribute.length;

  for (const distributingWallet in walletToDistribute) {
    const transfer = await wallet.createTransfer({
      destination: distributingWallet,
      amount: singleDistributionAmount,
      assetId: Coinbase.assets.Eth,
    });
  }
};

// const submitCampaign = async (campaign: string) => {
//   let wallet = await Wallet.create();
//   console.log(`Wallet successfully created: `, wallet.toString());

//   let address = await wallet.getDefaultAddress();
//   console.log(`Default address: `, address.toString());

//   let campaignId = await coinbase.createCampaign(campaign, wallet);
//   console.log(`Campaign successfully created: `, campaignId);
// };
