
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

export const validateInitialInvestment = async (
  currentAmount: number,
  initialSavings: number
): Promise<ValidationResult> => {
  try {
    // Get all existing goals to calculate total current amount
    const goalsString = localStorage.getItem('growvest_goals');
    const existingGoals = goalsString ? JSON.parse(goalsString) as Goal[] : [];
    
    // Calculate the total amount already used across all goals
    const totalUsed = existingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    
    // Check if adding this new amount would exceed initial savings
    if (totalUsed + currentAmount > initialSavings) {
      return {
        isValid: false,
        errorTitle: "Exceeds Available Savings",
        errorMessage: `The total principal amount across all goals would exceed your initial savings. You can allocate up to ${initialSavings - totalUsed} more.`
      };
    }
    
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errorTitle: "Error",
      errorMessage: "Failed to validate against initial savings. Please try again."
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
