
// Currency formatting utilities

// Format currency for display
export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore or more
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) { // 1 lakh or more
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
};

// Parse currency string back to number
export const parseCurrency = (currencyString: string): number => {
  // Remove ₹ symbol and commas
  let numStr = currencyString.replace('₹', '').replace(/,/g, '');
  
  // Handle Cr (crore) notation
  if (numStr.includes('Cr')) {
    return parseFloat(numStr.replace('Cr', '')) * 10000000;
  }
  
  // Handle L (lakh) notation
  if (numStr.includes('L')) {
    return parseFloat(numStr.replace('L', '')) * 100000;
  }
  
  return parseFloat(numStr);
};
