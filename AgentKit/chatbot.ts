import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";
import { EASService } from "./EASService";
import { ethers } from "ethers";

const { TwitterApi } = require("twitter-api-v2");
dotenv.config();
const client = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
  bearerToken: process.env.TWITTER_BEARER_TOKEN,
});
/**
 * Validates that required environment variables are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];

  // Check required variables
  const requiredVars = [
    "XAI_API_KEY",
    "CDP_API_KEY_NAME",
    "CDP_API_KEY_PRIVATE_KEY",
  ];
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Exit if any required variables are missing
  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach((varName) => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }

  // Warn about optional NETWORK_ID
  if (!process.env.NETWORK_ID) {
    console.warn(
      "Warning: NETWORK_ID not set, defaulting to base-sepolia testnet"
    );
  }
}

// Add this right after imports and before any other code
validateEnvironment();

// Configure a file to persist the agent's CDP MPC Wallet Data
const WALLET_DATA_FILE = "wallet_data.txt";

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
  try {
    // Initialize LLM with xAI configuration
    const llm = new ChatOpenAI({
      model: "grok-beta",
      apiKey: process.env.XAI_API_KEY,
      configuration: {
        baseURL: "https://api.x.ai/v1",
      },
    });

    let walletDataStr: string | null = null;

    // Read existing wallet data if available
    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
      } catch (error) {
        console.error("Error reading wallet data:", error);
        // Continue without wallet data
      }
    }

    // Configure CDP Agentkit
    const config = {
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    // Initialize CDP agentkit
    const agentkit = await CdpAgentkit.configureWithWallet(config);

    // Initialize CDP Agentkit Toolkit and get tools
    const cdpToolkit = new CdpToolkit(agentkit);
    const tools = cdpToolkit.getTools();

    // Store buffered conversation history in memory
    const memory = new MemorySaver();
    const agentConfig = {
      configurable: { thread_id: "PumpKit AI KOL" },
    };

    // Create React Agent using the LLM and CDP Agentkit tools
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier:
        "Given is the name of a token. Be creative and make a short post engaging content for token by using Web3 trending keywords. Do not include hashtags. Make it a 1-2 sentences short.",
    });

    // Save wallet data
    const exportedWallet = await agentkit.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error; // Re-throw to be handled by caller
  }
}

interface ApiError extends Error {
  code?: number | string;
  data?: {
    title?: string;
    detail?: string;
  };
}

async function testTwitterCredentials() {
  try {
    // Verify credentials are correctly formatted
    console.log("Checking Twitter API Credentials...");

    // Ensure all required credentials are present
    const requiredCredentials = [
      "TWITTER_APP_KEY",
      "TWITTER_APP_SECRET",
      "TWITTER_ACCESS_TOKEN",
      "TWITTER_ACCESS_SECRET",
    ];

    requiredCredentials.forEach((credential) => {
      if (!process.env[credential]) {
        console.error(`❌ Missing credential: ${credential}`);
        throw new Error(`Missing ${credential} environment variable`);
      }
    });

    const client = new TwitterApi({
      appKey: process.env.TWITTER_APP_KEY!,
      appSecret: process.env.TWITTER_APP_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // Attempt to get user information to verify credentials
    const userV2 = await client.v2.me();
    console.log("✅ Authentication Successful!");
    console.log("User ID:", userV2.data.id);
    console.log("Username:", userV2.data.username);
  } catch (error) {
    console.error("❌ Authentication Failed");

    // Type-safe error handling
    if (error instanceof Error) {
      // Check if it's an ApiError with a code
      const apiError = error as ApiError;

      if (apiError.code === 401) {
        console.log("Detailed 401 Error Analysis:");
        console.log("1. Incorrect API credentials");
        console.log("2. Tokens have been revoked");
        console.log("3. Insufficient API access level");
        console.log("4. App does not have write permissions");

        // Log additional error details if available
        if (apiError.data) {
          console.log("Error Title:", apiError.data.title);
          console.log("Error Detail:", apiError.data.detail);
        }
      }

      // Log the full error for debugging
      console.error("Full Error:", apiError);
    } else {
      // Handle any other type of error
      console.error("An unexpected error occurred:", error);
    }
  }
}

async function runChatMode(agent: any, config: any) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  try {
    // while (true) {
      const userInput = "Banana Token";
      const contractAddress = "0xa16302dBFD70c65a25E797ae41B3306E6E102eaF";
      const tokenChain ="BASE"
      const stream = await agent.stream(
        { messages: [new HumanMessage(userInput)] },
        config
      );
      let tweetContent = "";
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          tweetContent = chunk.agent.messages[0].content;
        } else if ("tools" in chunk) {
          tweetContent = chunk.tools.messages[0].content;
        }
      }
      if (tweetContent) {
        try {
          const { data: createdTweet } = await client.v2.tweet({
            text: tweetContent,
          });

          console.log("Tweet posted successfully!");
          console.log(`Tweet ID: ${createdTweet.id}`);
          const signer = new ethers.Wallet(
            "a2bca99decc6b4cb64ea139967892a474ad8350a6f77cadbad3ba61bbed1f6cf",
            ethers.getDefaultProvider("https://sepolia.base.org")
          ); // Replace with your private key and network URL
          const easService = new EASService();

          await easService.connect(signer);
          const startDate = new Date(); // Current date and time
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 7);
          const data = {
            tokenName: userInput,
            tokenAddress: contractAddress,
            tokenChain: tokenChain,
            postLinks: [
              `https://twitter.com/pumpkitx/status/${createdTweet.id}`,
            ],
            startDate: startDate.toDateString(),
            endDate: endDate.toDateString(),
          };

          const recipient = "0x0000000000000000000000000000000000000000";
          const attestationUID = await easService.createAttestation({
            data,
            recipient,
            revocable: true,
            expirationTime: 0,
          });

          console.log("New attestation UID:", attestationUID);
        } catch (error) {
          console.error("Error posting tweet:", error);
        }
      }
    // }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Start the chatbot agent
 */
async function main() {
  try {
    const { agent, config } = await initializeAgent();

    await runChatMode(agent, config);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  console.log("Starting Agent...");
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
