
import { Goal } from '@/types/finance';
import { parseCurrency } from '@/services/api';

interface ValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorMessage?: string;
}

export const validateGoalForm = (
  targetAmountStr: string,
  currentAmountStr: string,
  timeline: number
): ValidationResult => {
  try {
    // Parse currency strings back to numbers
    const parsedTargetAmount = parseCurrency(targetAmountStr);
    const parsedCurrentAmount = parseCurrency(currentAmountStr);
    
    // Validate target amount and current amount
    if (isNaN(parsedTargetAmount) || isNaN(parsedCurrentAmount)) {
      return {
        isValid: false,
        errorTitle: "Error",
        errorMessage: "Target amount and current amount must be valid numbers."
      };
    }
    
    if (parsedTargetAmount <= 0) {
      return {
        isValid: false,
        errorTitle: "Error",
        errorMessage: "Target amount must be greater than zero."
      };
    }
    
    if (parsedCurrentAmount < 0) {
      return {
        isValid: false,
        errorTitle: "Error",
        errorMessage: "Current amount cannot be negative."
      };
    }
    
    // Validate timeline
    if (timeline <= 0) {
      return {
        isValid: false,
        errorTitle: "Error",
        errorMessage: "Timeline must be greater than zero."
      };
    }
    
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errorTitle: "Error",
      errorMessage: "Failed to validate form. Please check your inputs and try again."
    };
  }
};

export const prepareGoalData = (
  formData: {
    id: string;
    title: string;
    targetAmount: string; 
    currentAmount: string;
    timeline: number;
    category: Goal['category'];
    riskLevel: Goal['riskLevel'];
  },
  monthlyContribution: number
): Partial<Goal> => {
  const parsedTargetAmount = parseCurrency(formData.targetAmount);
  const parsedCurrentAmount = parseCurrency(formData.currentAmount);
  
  return {
    id: formData.id,
    title: formData.title,
    targetAmount: parsedTargetAmount,
    currentAmount: parsedCurrentAmount,
    timeline: formData.timeline,
    category: formData.category,
    riskLevel: formData.riskLevel,
    monthlyContribution: monthlyContribution,
    progress: Math.min(100, Math.round((parsedCurrentAmount / parsedTargetAmount) * 100)),
  };
};
