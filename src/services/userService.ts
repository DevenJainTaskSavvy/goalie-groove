
import { UserProfile } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';

// Save or update user profile
export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user || !user.user) {
      throw new Error("Not authenticated");
    }
    
    const userId = user.user.id;
    
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          name: profile.name,
          age: profile.age,
          savings: profile.savings,
          monthly_investment_capacity: profile.monthlyInvestmentCapacity,
          relationship_status: profile.relationshipStatus,
          has_kids: profile.hasKids,
          retirement_age: profile.retirementAge,
          purchase_plans: profile.purchasePlans,
          risk_tolerance: profile.riskTolerance,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return mapToUserProfile(data);
    } else {
      // Insert new profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          name: profile.name,
          age: profile.age,
          savings: profile.savings,
          monthly_investment_capacity: profile.monthlyInvestmentCapacity,
          relationship_status: profile.relationshipStatus,
          has_kids: profile.hasKids,
          retirement_age: profile.retirementAge,
          purchase_plans: profile.purchasePlans,
          risk_tolerance: profile.riskTolerance
        })
        .select()
        .single();
      
      if (error) throw error;
      return mapToUserProfile(data);
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user || !user.user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();
    
    if (error) {
      // If no profile found, return null instead of throwing
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return mapToUserProfile(data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Helper function to map database fields to our UserProfile type
const mapToUserProfile = (data: any): UserProfile => {
  return {
    name: data.name,
    age: data.age,
    savings: data.savings,
    monthlyInvestmentCapacity: data.monthly_investment_capacity,
    relationshipStatus: data.relationship_status,
    hasKids: data.has_kids,
    retirementAge: data.retirement_age,
    purchasePlans: data.purchase_plans,
    riskTolerance: data.risk_tolerance
  };
};
