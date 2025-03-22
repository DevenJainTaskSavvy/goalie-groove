
import { Goal } from '@/types/finance';
import { getUserProfile } from '../userService';
import { supabase } from '@/integrations/supabase/client';
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
