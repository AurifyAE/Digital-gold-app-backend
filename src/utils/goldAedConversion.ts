import { getUsdToAedGoldRate } from "./aedRateCache";

export const computeGoldAed = (bid: number) => {
  const ounce = 31.103;
  const rate = getUsdToAedGoldRate(); // USD to AED conversion rate

  const oneGmUsd = bid / ounce;
  const result = oneGmUsd * rate;

  return parseFloat(result.toFixed(2));
};