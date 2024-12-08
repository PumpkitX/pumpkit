import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { Signer } from "ethers";

const easContractAddress = "0x4200000000000000000000000000000000000021";
const schemaUID =
  "0xf78700dc15d60dd532e9ab9b9d1a270bf4422d3bac0b008198e34ff78c6281d8";

export class EASService {
  private eas: EAS;
  private schemaEncoder: SchemaEncoder;

  constructor() {
    this.eas = new EAS(easContractAddress);
    this.schemaEncoder = new SchemaEncoder(
      "string tokenName,address tokenAddress,string tokenChain,string[] postLinks,string startDate,string endDate"
    );
  }

  async connect(signer: Signer): Promise<void> {
    await this.eas.connect(signer);
  }

  async createAttestation({
    data,
    recipient,
    revocable = true,
    expirationTime = 0,
  }: {
    data: {
      tokenName: string;
      tokenAddress: string;
      tokenChain: string;
      postLinks: string[];
      startDate: string;
      endDate: string;
    };
    recipient: string;
    revocable?: boolean;
    expirationTime?: number | bigint; // Accept both types for flexibility
  }): Promise<string> {
    const encodedData = this.schemaEncoder.encodeData([
      { name: "tokenName", value: data.tokenName, type: "string" },
      { name: "tokenAddress", value: data.tokenAddress, type: "address" },
      { name: "tokenChain", value: data.tokenChain, type: "string" },
      { name: "postLinks", value: data.postLinks, type: "string[]" },
      { name: "startDate", value: data.startDate, type: "string" },
      { name: "endDate", value: data.endDate, type: "string" },
    ]);

    // Ensure expirationTime is a bigint
    const expirationTimeBigInt =
      typeof expirationTime === "number"
        ? BigInt(expirationTime)
        : expirationTime;

    const tx = await this.eas.attest({
      schema: schemaUID,
      data: {
        recipient,
        expirationTime: expirationTimeBigInt, // Use bigint value
        revocable,
        data: encodedData,
      },
    });

    const attestationUID = await tx.wait();
    return attestationUID;
  }
}
