
import { Goal } from '@/types/finance';
import { getUserProfile } from './userService';
import { calculateMonthlyContribution } from './utils/financialCalculations';
import { supabase } from '@/integrations/supabase/client';

// Add a new financial goal
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

// Edit existing goal
export const updateGoal = async (goalData: Partial<Goal>): Promise<Goal> => {
  try {
    if (!goalData.id) {
      throw new Error("Goal ID is required");
    }
    
    const userProfile = await getUserProfile();
    
    if (!userProfile) {
      throw new Error("User profile not found");
    }
    
    const { data: user } = await supabase.auth.getUser();
    
    if (!user || !user.user) {
      throw new Error("Not authenticated");
    }
    
    // Get the existing goal
    const { data: existingGoal, error: fetchError } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('id', goalData.id)
      .eq('user_id', user.user.id)
      .single();
    
    if (fetchError) throw fetchError;
    if (!existingGoal) throw new Error("Goal not found");
    
    // Calculate if the user has enough monthly investment capacity (if changing contribution)
    if (goalData.monthlyContribution !== undefined && 
        goalData.monthlyContribution !== existingGoal.monthly_contribution) {
      
      // Get all other goals
      const { data: otherGoals, error: goalsError } = await supabase
        .from('financial_goals')
        .select('monthly_contribution')
        .eq('user_id', user.user.id)
        .neq('id', goalData.id);
      
      if (goalsError) throw goalsError;
      
      const totalOtherGoals = otherGoals
        ? otherGoals.reduce((sum, goal) => sum + goal.monthly_contribution, 0)
        : 0;
      
      if (totalOtherGoals + goalData.monthlyContribution > userProfile.monthlyInvestmentCapacity) {
        throw new Error("Updating this goal would exceed your monthly investment capacity");
      }
    }
    
    // Update progress if target or current amount changed
    let progress = existingGoal.progress;
    
    if ((goalData.targetAmount !== undefined || goalData.currentAmount !== undefined)) {
      const targetAmount = goalData.targetAmount !== undefined ? goalData.targetAmount : existingGoal.target_amount;
      const currentAmount = goalData.currentAmount !== undefined ? goalData.currentAmount : existingGoal.current_amount;
      progress = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
    }
    
    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (goalData.title !== undefined) updateData.title = goalData.title;
    if (goalData.targetAmount !== undefined) updateData.target_amount = goalData.targetAmount;
    if (goalData.currentAmount !== undefined) updateData.current_amount = goalData.currentAmount;
    if (goalData.timeline !== undefined) updateData.timeline = goalData.timeline;
    if (goalData.category !== undefined) updateData.category = goalData.category;
    if (goalData.monthlyContribution !== undefined) updateData.monthly_contribution = goalData.monthlyContribution;
    if (goalData.riskLevel !== undefined) updateData.risk_level = goalData.riskLevel;
    if (goalData.description !== undefined) updateData.description = goalData.description;
    updateData.progress = progress;
    
    // Update the goal
    const { data, error } = await supabase
      .from('financial_goals')
      .update(updateData)
      .eq('id', goalData.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return mapToGoal(data);
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

// Get all goals
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

// Delete a goal
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

// Calculate remaining monthly investment capacity
export const getRemainingMonthlyCapacity = async (): Promise<number> => {
  try {
    const userProfile = await getUserProfile();
    
    if (!userProfile) {
      return 0;
    }
    
    const allGoals = await getGoals();
    
    const currentTotalMonthly = allGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
    return Math.max(0, userProfile.monthlyInvestmentCapacity - currentTotalMonthly);
  } catch (error) {
    console.error('Error calculating remaining capacity:', error);
    return 0;
  }
};

// Helper function to map database fields to our Goal type
const mapToGoal = (data: any): Goal => {
  return {
    id: data.id,
    title: data.title,
    targetAmount: data.target_amount,
    currentAmount: data.current_amount,
    timeline: data.timeline,
    progress: data.progress,
    category: data.category,
    monthlyContribution: data.monthly_contribution,
    riskLevel: data.risk_level,
    description: data.description
  };
};
