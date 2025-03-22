
// Financial calculations

// Calculate monthly contribution needed to reach goal
export const calculateMonthlyContribution = (
  targetAmount: number,
  currentAmount: number,
  timelineYears: number,
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
): number => {
  // Different expected annual returns based on risk level
  const annualReturns = {
    conservative: 0.06, // 6%
    moderate: 0.10,     // 10%
    aggressive: 0.14    // 14%
  };
  
  const rate = annualReturns[riskLevel] / 12; // Monthly rate
  const months = timelineYears * 12;
  
  // Calculate future value of current savings
  const futureValueOfCurrentSavings = currentAmount * Math.pow(1 + rate, months);
  
  // Calculate required future value
  const amountNeeded = targetAmount - futureValueOfCurrentSavings;
  
  if (amountNeeded <= 0) {
    return 0; // Already saved enough
  }
  
  // Formula for calculating monthly payment for future value
  // PMT = FV * r / ((1 + r)^n - 1)
  const monthlyPayment = amountNeeded * rate / (Math.pow(1 + rate, months) - 1);
  
  return Math.max(0, Math.ceil(monthlyPayment));
};
