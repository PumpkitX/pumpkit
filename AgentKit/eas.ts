import { EASService } from "./EASService";
import { ethers } from "ethers";

async function main() {
  const signer = new ethers.Wallet(
    "a2bca99decc6b4cb64ea139967892a474ad8350a6f77cadbad3ba61bbed1f6cf",
    ethers.getDefaultProvider("https://sepolia.base.org")
  ); // Replace with your private key and network URL
  const easService = new EASService();

  await easService.connect(signer);

  const data = {
    tokenName: "SampleToken",
    tokenAddress: "0x0000000000000000000000000000000000000000",
    tokenChain: "Ethereum",
    postLinks: ["https://example.com"],
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  };

  const recipient = "0x0000000000000000000000000000000000000000";
  const attestationUID = await easService.createAttestation({
    data,
    recipient,
    revocable: true,
    expirationTime: 0,
  });

  console.log("New attestation UID:", attestationUID);
}

main().catch((err) => console.error(err));
