// Filename: index.ts
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK, LIT_ABILITY, LIT_RPC } from "@lit-protocol/constants";
import { LitActionResource, LitPKPResource } from "@lit-protocol/auth-helpers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { EthWalletProvider } from "@lit-protocol/lit-auth-client";
import * as ethers from "ethers";
import * as fs from "fs";
import path from "path";
import schedule from "node-schedule";
import { litActionCode } from "./litAction";
import { analyzeTweetData } from "./analayzeTweetData";

// Import AI model or library for analysis (e.g., TensorFlow.js or OpenAI)
//  Example AI analysis module

const { ETHEREUM_PRIVATE_KEY, CHAIN_RPC } = process.env;
const NETWORK = LIT_NETWORK.DatilDev;

// Filepath for PKP info and tweet data
const PKP_INFO_FILE = path.join(__dirname, "pkpInfo.json");
const TWEET_DATA_FILE = path.join(__dirname, "tweetData.json");

// Function to generate PKP
export const generatePKP = async () => {
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

    // Mint PKP
    const pkp = (await litContracts.pkpNftContractUtils.write.mint()).pkp;

    console.log("PKP: ", pkp);

    // Authenticate with Lit
    const authMethod = await EthWalletProvider.authenticate({
      signer: ethersWallet,
      litNodeClient,
    });

    // Get PKP session signatures
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

    console.log("PKP Generated Successfully!");

    return {
      pkp,
      pkpSessionSigs,
    };
  } catch (error) {
    console.error("Error generating PKP:", error);
    throw error;
  } finally {
    litNodeClient?.disconnect();
  }
};

// Function to distribute tokens based on AI analysis of tweet data
const distributeTokensWithAI = async () => {
  try {
    // Load PKP info
    if (!fs.existsSync(PKP_INFO_FILE)) {
      throw new Error("PKP Info file does not exist. Create the agent first.");
    }

    // await litNodeClient.connect();

    // Load Tweet Data
    if (!fs.existsSync(TWEET_DATA_FILE)) {
      throw new Error("Tweet data file does not exist.");
    }
    const tweetData = JSON.parse(fs.readFileSync(TWEET_DATA_FILE, "utf-8"));

    console.log("Loaded Tweet Data:", tweetData);

    // Analyze tweet data using AI
    const distributionDecision = await analyzeTweetData(tweetData); // Returns a decision object
    console.log("AI Analysis Result:", distributionDecision);

    // Check if distribution should happen
    if (!distributionDecision.shouldDistribute) {
      console.log("Distribution not required based on AI analysis.");
      return;
    }

    // Calculate staged distribution
    const totalAmount = ethers.utils.parseUnits("1000", 18); // Example total amount to distribute
    const stages = distributionDecision.stages || 3;
    const stageAmount = totalAmount.div(stages);

    console.log(
      `Distributing ${ethers.utils.formatUnits(
        stageAmount,
        18
      )} tokens in ${stages} stages.`
    );

    const pkpInfo = JSON.parse(fs.readFileSync(PKP_INFO_FILE, "utf-8"));

    const { pkp, pkpSessionSigs } = pkpInfo;

    const litNodeClient = new LitNodeClient({
      litNetwork: NETWORK,
      debug: false,
    });

    const ethersWallet = new ethers.Wallet(
      ETHEREUM_PRIVATE_KEY!,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );

    const litContracts = new LitContracts({
      signer: ethersWallet,
      network: NETWORK,
      debug: false,
    });
    await litContracts.connect();

    for (let stage = 1; stage <= stages; stage++) {
      const stageDate = new Date();
      stageDate.setDate(stageDate.getDate() + stage * 30); // Calculate stage date (30, 60, 90 days, etc.)

      console.log(
        `Scheduling stage ${stage} to run at: ${stageDate.toISOString()}`
      );

      schedule.scheduleJob(stageDate, async () => {
        console.log(`Starting distribution stage ${stage}...`);

        try {
          const result = await litNodeClient.executeJs({
            sessionSigs: pkpSessionSigs,
            code: litActionCode,
            jsParams: {
              publicKey: pkp.publicKey!,
              privatKey: ETHEREUM_PRIVATE_KEY,
              chainRPC: CHAIN_RPC,
              amount: ethers.utils.formatUnits(stageAmount, 18),
              recipients: distributionDecision.recipients, // Recipients from AI analysis
            },
          });

          console.log(`Stage ${stage} distribution complete. Result:`, result);
        } catch (error) {
          console.error(`Error in stage ${stage} distribution:`, error);
        }
      });
    }

    console.log("Token distribution completed.");
  } catch (error) {
    console.error("Error distributing tokens:", error);
  }
};

function scheduleJobForTenDaysLater(): void {
  // Calculate the date and time 10 days from now
  const runDate = new Date();
  runDate.setDate(runDate.getDate() + 10);

  console.log(`Job scheduled to run at: ${runDate.toISOString()}`);

  // Schedule the job using node-schedule
  schedule.scheduleJob(runDate, () => {
    distributeTokensWithAI();
  });
}

scheduleJobForTenDaysLater();
// // Execute functions
// (async () => {
//   await generatePKP();
//   await distributeTokensWithAI();
// })();

// create
