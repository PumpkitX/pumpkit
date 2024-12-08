export interface Token {
  symbol: string;
  name: string;
  balance: string;
  address: string;
}

export interface PumpedToken extends Token {
  postsCount: number;
  interactions: number;
  remainingFunds: string;
}