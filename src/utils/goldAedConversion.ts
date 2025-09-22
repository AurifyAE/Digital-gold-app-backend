export const computeGoldAed = (bid: number) => {
  const ounce = 31.103;
  const rate = 3.674; // USD to AED conversion rate

  const oneGmUsd = bid / ounce;
  const result = oneGmUsd * rate;
    
  return parseFloat(result.toFixed(2)); 
};