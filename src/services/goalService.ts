
import { Goal } from '@/types/finance';
import { getUserProfile } from './userService';
import { calculateMonthlyContribution } from './utils/financialCalculations';

// In-memory storage for goals
let goals: Goal[] = [];

// Generate a random ID for goals
const generateId = () => Math.random().toString(36).substring(2, 15);

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

// Edit existing goal
export const updateGoal = (goalData: Partial<Goal>): Promise<Goal> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userProfile = await getUserProfile();
      
      if (!userProfile) {
        reject(new Error("User profile not found"));
        return;
      }
      
      // Find the goal to update
      const goalIndex = goals.findIndex(goal => goal.id === goalData.id);
      
      if (goalIndex === -1) {
        reject(new Error("Goal not found"));
        return;
      }
      
      // Calculate if the user has enough monthly investment capacity
      if (goalData.monthlyContribution) {
        const oldContribution = goals[goalIndex].monthlyContribution;
        const contributionDifference = goalData.monthlyContribution - oldContribution;
        
        // Calculate total without this goal
        const totalOtherGoals = goals.reduce((sum, goal) => {
          return goal.id === goalData.id ? sum : sum + goal.monthlyContribution;
        }, 0);
        
        if (totalOtherGoals + goalData.monthlyContribution > userProfile.monthlyInvestmentCapacity) {
          reject(new Error("Updating this goal would exceed your monthly investment capacity"));
          return;
        }
      }
      
      // Update the goal in memory
      const updatedGoal = { ...goals[goalIndex], ...goalData };
      goals[goalIndex] = updatedGoal;
      
      // Update in localStorage for persistence
      const storedGoals = JSON.parse(localStorage.getItem('growvest_goals') || '[]');
      const storedGoalIndex = storedGoals.findIndex((g: Goal) => g.id === goalData.id);
      
      if (storedGoalIndex !== -1) {
        storedGoals[storedGoalIndex] = updatedGoal;
        localStorage.setItem('growvest_goals', JSON.stringify(storedGoals));
      }
      
      setTimeout(() => resolve(updatedGoal), 500); // Simulate network delay
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
