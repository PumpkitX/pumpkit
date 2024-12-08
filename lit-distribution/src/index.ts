// Filename: index.ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK, LIT_ABILITY, LIT_RPC } from "@lit-protocol/constants";
import { LitActionResource, LitPKPResource } from "@lit-protocol/auth-helpers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { EthWalletProvider } from "@lit-protocol/lit-auth-client";
import * as ethers from "ethers";
import { litActionCode } from "./litAction";

const { ETHEREUM_PRIVATE_KEY } = process.env;
const NETWORK = LIT_NETWORK.DatilDev;

export const execute = async () => {
  const litNodeClient = new LitNodeClient({
    litNetwork: NETWORK,
    debug: false,
  });
  try {
    const ethersWallet = new ethers.Wallet(
      ETHEREUM_PRIVATE_KEY!,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );
    await litNodeClient.connect();

    const litContracts = new LitContracts({
      signer: ethersWallet,
      network: NETWORK,
      debug: false,
    });
    await litContracts.connect();

    const pkp = (await litContracts.pkpNftContractUtils.write.mint()).pkp;

    console.log("PKP: ", pkp);

    const authMethod = await EthWalletProvider.authenticate({
      signer: ethersWallet,
      litNodeClient,
    });

    const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
      pkpPublicKey: pkp.publicKey!,
      chain: "ethereum",
      authMethods: [authMethod],
      resourceAbilityRequests: [
        {
          resource: new LitActionResource("*"),
          ability: LIT_ABILITY.LitActionExecution,
        },
        { resource: new LitPKPResource("*"), ability: LIT_ABILITY.PKPSigning },
      ],
    });

    const result = await litNodeClient.executeJs({
      sessionSigs: pkpSessionSigs,
      code: litActionCode,
      jsParams: { publicKey: pkp.publicKey! },
    });

    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    litNodeClient?.disconnect();
  }
};

execute();
