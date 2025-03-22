
import { Goal } from '@/types/finance';
import { getUserProfile } from '../userService';
import { supabase } from '@/integrations/supabase/client';
import { mapToGoal } from './goalMappers';

/**
 * Add a new financial goal
 */
export const addGoal = async (goalData: Omit<Goal, 'id' | 'progress'>): Promise<Goal> => {
  try {
    const userProfile = await getUserProfile();
    
    if (!userProfile) {
      throw new Error("User profile not found");
    }
    
    const { data: user } = await supabase.auth.getUser();
    
    if (!user || !user.user) {
      throw new Error("Not authenticated");
    }
    
    // Get all existing goals to check monthly investment capacity
    const { data: existingGoals, error: fetchError } = await supabase
      .from('financial_goals')
      .select('monthly_contribution')
      .eq('user_id', user.user.id);
    
    if (fetchError) throw fetchError;
    
    // Calculate if the user has enough monthly investment capacity
    const currentTotalMonthly = existingGoals 
      ? existingGoals.reduce((sum, goal) => sum + goal.monthly_contribution, 0) 
      : 0;
    const newMonthlyRequired = goalData.monthlyContribution;
    
    if (currentTotalMonthly + newMonthlyRequired > userProfile.monthlyInvestmentCapacity) {
      throw new Error("Adding this goal would exceed your monthly investment capacity");
    }
    
    const progress = Math.min(100, Math.round((goalData.currentAmount / goalData.targetAmount) * 100));
    
    // Insert the new goal
    const { data, error } = await supabase
      .from('financial_goals')
      .insert({
        user_id: user.user.id,
        title: goalData.title,
        target_amount: goalData.targetAmount,
        current_amount: goalData.currentAmount,
        timeline: goalData.timeline,
        category: goalData.category,
        monthly_contribution: goalData.monthlyContribution,
        risk_level: goalData.riskLevel,
        progress: progress,
        description: goalData.description
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return mapToGoal(data);
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
    const { data: user } = await supabase.auth.getUser();
    
    if (!user || !user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(mapToGoal);
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
    const { data: user } = await supabase.auth.getUser();
    
    if (!user || !user.user) {
      throw new Error("Not authenticated");
    }
    
    const { error } = await supabase
      .from('financial_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', user.user.id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};
