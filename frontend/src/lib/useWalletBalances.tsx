// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useAccount } from "wagmi";
import { readContracts } from "wagmi/actions";
import { useWagmiConfig } from "../context/wagmi";
// import { multicall } from "wagmi/actions";

// ERC20 ABI for balance and details
const erc20ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

// Known token list (example)
const KNOWN_TOKENS = [
  "0xa16302dBFD70c65a25E797ae41B3306E6E102eaF",
  "0x87C51CD469A0E1E2aF0e0e597fD88D9Ae4BaA967",
  "0xa8cB1964ea7f9674Ac6EC2Bc87D386380bE264F8",
  "0x5878e492fba20F47884841d093b79d259B5B799B",
  // Add more token addresses
];

export default function useTokenBalances() {
  const { address } = useAccount();
  const config = useWagmiConfig();

  const fetchTokenBalances = async () => {
    if (!address) return [];

    // Prepare contract calls
    const contracts = KNOWN_TOKENS.flatMap((tokenAddress) => [
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "name",
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "symbol",
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "decimals",
      },
    ]);

    try {
      // Batch read contract data
      const results = await readContracts(config, {
        contracts,
      });

      // Process results
      const tokenBalances = [];
      for (let i = 0; i < KNOWN_TOKENS.length; i++) {
        const balance = results[i * 4];
        const name = results[i * 4 + 1];
        const symbol = results[i * 4 + 2];
        const decimals = results[i * 4 + 3];

        // Filter out zero balance tokens
        if (balance && balance > 0n) {
          tokenBalances.push({
            address: KNOWN_TOKENS[i],
            name,
            symbol,
            decimals,
            balance: balance.toString(),
          });
        }
      }

      return tokenBalances;
    } catch (error) {
      console.error("Error fetching token balances", error);
      return [];
    }
  };

  return { fetchTokenBalances };
}

// // Component example
// export function TokenBalances() {
//   const { address } = useAccount();
//   const { fetchTokenBalances } = useTokenBalances();
//   const [tokens, setTokens] = useState([]);

//   useEffect(() => {
//     const loadTokens = async () => {
//       const tokenBalances = await fetchTokenBalances();
//       console.log("bal", tokenBalances);
//       setTokens(tokenBalances);
//     };

//     if (address) {
//       loadTokens();
//     }
//   }, [address]);

//   return (
//     <div>
//       {tokens.map((token) => (
//         <div key={token.address}>
//           {token.symbol}: {token.balance}
//         </div>
//       ))}
//     </div>
//   );
// }
