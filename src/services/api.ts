
import { UserProfile, Goal, GoalCategory } from '@/types/finance';

// In-memory storage for our mock backend
let userData: UserProfile | null = null;
let goals: Goal[] = [];

// Generate a random ID for goals
const generateId = () => Math.random().toString(36).substring(2, 15);

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

// Create or update user profile
export const saveUserProfile = (profile: UserProfile): Promise<UserProfile> => {
  return new Promise((resolve) => {
    userData = profile;
    localStorage.setItem('growvest_user', JSON.stringify(profile));
    setTimeout(() => resolve(profile), 500); // Simulate network delay
  });
};

// Get user profile
export const getUserProfile = (): Promise<UserProfile | null> => {
  return new Promise((resolve) => {
    if (userData) {
      resolve(userData);
      return;
    }
    
    const storedUser = localStorage.getItem('growvest_user');
    if (storedUser) {
      userData = JSON.parse(storedUser);
    }
    
    setTimeout(() => resolve(userData), 300); // Simulate network delay
  });
};

// Add a new financial goal
export const addGoal = (goalData: Omit<Goal, 'id' | 'progress'>): Promise<Goal> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userProfile = await getUserProfile();
      
      if (!userProfile) {
        reject(new Error("User profile not found"));
        return;
      }
      
      // Calculate if the user has enough monthly investment capacity
      const currentTotalMonthly = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
      const newMonthlyRequired = goalData.monthlyContribution;
      
      if (currentTotalMonthly + newMonthlyRequired > userProfile.monthlyInvestmentCapacity) {
        reject(new Error("Adding this goal would exceed your monthly investment capacity"));
        return;
      }
      
      const progress = Math.min(100, Math.round((goalData.currentAmount / goalData.targetAmount) * 100));
      
      const newGoal: Goal = {
        ...goalData,
        id: generateId(),
        progress
      };
      
      goals.push(newGoal);
      
      // Also store in localStorage for persistence
      const storedGoals = localStorage.getItem('growvest_goals') ? 
        JSON.parse(localStorage.getItem('growvest_goals') || '[]') : [];
      storedGoals.push(newGoal);
      localStorage.setItem('growvest_goals', JSON.stringify(storedGoals));
      
      setTimeout(() => resolve(newGoal), 500); // Simulate network delay
    } catch (error) {
      reject(error);
    }
  });
};

// Get all goals
export const getGoals = (): Promise<Goal[]> => {
  return new Promise((resolve) => {
    if (goals.length === 0) {
      const storedGoals = localStorage.getItem('growvest_goals');
      if (storedGoals) {
        goals = JSON.parse(storedGoals);
      }
    }
    
    setTimeout(() => resolve([...goals]), 300); // Simulate network delay
  });
};

// Delete a goal
export const deleteGoal = (goalId: string): Promise<void> => {
  return new Promise((resolve) => {
    goals = goals.filter(goal => goal.id !== goalId);
    
    // Update localStorage
    localStorage.setItem('growvest_goals', JSON.stringify(goals));
    
    setTimeout(() => resolve(), 300); // Simulate network delay
  });
};

// Calculate remaining monthly investment capacity
export const getRemainingMonthlyCapacity = async (): Promise<number> => {
  const userProfile = await getUserProfile();
  const allGoals = await getGoals();
  
  if (!userProfile) {
    return 0;
  }
  
  const currentTotalMonthly = allGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  return Math.max(0, userProfile.monthlyInvestmentCapacity - currentTotalMonthly);
};
