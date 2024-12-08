import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a new instance of GoogleGenerativeAI with the current API key
function createGenAIInstance(): GoogleGenerativeAI {
  const apiKey = "AIzaSyA0nnPK11pJKS5myavpEieLnDooDpC4PJM";
  return new GoogleGenerativeAI(apiKey);
}

// Interface for the distribution decision
interface DistributionDecision {
  shouldDistribute: boolean;
  stages: number;
  recipients: string[];
  distributionPlan: {
    stage: number;
    tokens: string;
    condition: string;
  }[];
}

export async function analyzeTweetData(
  tweetData: any
): Promise<DistributionDecision> {
  const genAI = createGenAIInstance();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Generate a prompt for AI analysis
  const prompt = `
      Analyze the following Twitter data and decide if token distribution should occur. Provide detailed reasoning:
      ${JSON.stringify(tweetData, null, 2)}
      Return a decision like:
      {
        "shouldDistribute": true/false,
        "stages": number of stages,
        "recipients": ["address1", "address2", ...],
        "distributionPlan": [
          {"stage": 1, "tokens": "1000", "condition": "..."},
          {"stage": 2, "tokens": "2000", "condition": "..."}
        ]
      }
    `;

  const result = await model.generateContent(prompt);

  // Parse the response and ensure it matches the interface
  const distributionDecision: DistributionDecision = JSON.parse(
    result.response?.text() || "{}"
  );

  return distributionDecision;
}
