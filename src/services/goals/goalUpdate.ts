
import { Goal } from '@/types/finance';
import { getUserProfile } from '../userService';
import { mapToGoal } from './goalMappers';

/**
 * Edit existing goal
 */
export const updateGoal = async (goalData: Partial<Goal>): Promise<Goal> => {
  try {
    if (!goalData.id) {
      throw new Error("Goal ID is required");
    }
    
    const userProfile = await getUserProfile();
    
    if (!userProfile) {
      throw new Error("User profile not found");
    }
    
    // Get all existing goals
    const goalsString = localStorage.getItem('growvest_goals');
    
    if (!goalsString) {
      throw new Error("No goals found");
    }
    
    const goals: Goal[] = JSON.parse(goalsString);
    
    // Find the goal to update
    const existingGoalIndex = goals.findIndex(goal => goal.id === goalData.id);
    
    if (existingGoalIndex === -1) {
      throw new Error("Goal not found");
    }
    
    const existingGoal = goals[existingGoalIndex];
    
    // Calculate if the user has enough monthly investment capacity (if changing contribution)
    if (goalData.monthlyContribution !== undefined && 
        goalData.monthlyContribution !== existingGoal.monthlyContribution) {
      
      // Calculate total contribution of other goals
      const totalOtherGoals = goals
        .filter(goal => goal.id !== goalData.id)
        .reduce((sum, goal) => sum + goal.monthlyContribution, 0);
      
      if (totalOtherGoals + goalData.monthlyContribution > userProfile.monthlyInvestmentCapacity) {
        throw new Error("Updating this goal would exceed your monthly investment capacity");
      }
    }
    
    // Update progress if target or current amount changed
    let progress = existingGoal.progress;
    
    if ((goalData.targetAmount !== undefined || goalData.currentAmount !== undefined)) {
      const targetAmount = goalData.targetAmount !== undefined ? goalData.targetAmount : existingGoal.targetAmount;
      const currentAmount = goalData.currentAmount !== undefined ? goalData.currentAmount : existingGoal.currentAmount;
      progress = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
    }
    
    // Create updated goal
    const updatedGoal: Goal = {
      ...existingGoal,
      ...goalData,
      progress
    };
    
    // Update goal in the list
    goals[existingGoalIndex] = updatedGoal;
    
    // Save to localStorage
    localStorage.setItem('growvest_goals', JSON.stringify(goals));
    
    return updatedGoal;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};
