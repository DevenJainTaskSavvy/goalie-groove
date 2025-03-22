
import { Goal } from '@/types/finance';
import { getUserProfile } from '../userService';
import { mapToGoal } from './goalMappers';
import { validateInitialInvestment } from '@/components/dashboard/goalFormValidation';

/**
 * Add a new financial goal
 */
export const addGoal = async (goalData: Omit<Goal, 'id' | 'progress'>): Promise<Goal> => {
  try {
    const userProfile = await getUserProfile();
    
    if (!userProfile) {
      throw new Error("User profile not found");
    }
    
    // Get all existing goals to check monthly investment capacity
    const existingGoalsString = localStorage.getItem('growvest_goals');
    const existingGoals: Goal[] = existingGoalsString ? JSON.parse(existingGoalsString) : [];
    
    // Calculate if the user has enough monthly investment capacity
    const currentTotalMonthly = existingGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
    const newMonthlyRequired = goalData.monthlyContribution;
    
    if (currentTotalMonthly + newMonthlyRequired > userProfile.monthlyInvestmentCapacity) {
      throw new Error("Adding this goal would exceed your monthly investment capacity");
    }
    
    // Check if the current amount would exceed initial savings
    const validationResult = await validateInitialInvestment(goalData.currentAmount, userProfile.savings);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errorMessage || "Would exceed initial savings");
    }
    
    const progress = Math.min(100, Math.round((goalData.currentAmount / goalData.targetAmount) * 100));
    
    // Create new goal with generated ID
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      ...goalData,
      progress: progress
    };
    
    // Add to existing goals and save to localStorage
    existingGoals.push(newGoal);
    localStorage.setItem('growvest_goals', JSON.stringify(existingGoals));
    
    return newGoal;
  } catch (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
};

/**
 * Get all goals for the current user
 */
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const goalsString = localStorage.getItem('growvest_goals');
    
    if (!goalsString) {
      return [];
    }
    
    return JSON.parse(goalsString) as Goal[];
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
};

/**
 * Delete a goal
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
  try {
    const goalsString = localStorage.getItem('growvest_goals');
    
    if (!goalsString) {
      return;
    }
    
    const goals: Goal[] = JSON.parse(goalsString);
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    
    localStorage.setItem('growvest_goals', JSON.stringify(updatedGoals));
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};
