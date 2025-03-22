
import { UserProfile } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';

// Save or update user profile
export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    // First check if we have a logged in user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error("Not authenticated");
    }
    
    const userId = session.user.id;
    
    // Try to get existing profile from Supabase
    const { data: existingProfile, error: getError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (getError && getError.code !== 'PGRST116') { // PGRST116 is "row not found" error
      console.error('Error fetching profile:', getError);
      // If there's an error other than "not found", throw it
      throw getError;
    }
    
    // If profile exists, update it; otherwise insert it
    if (existingProfile) {
      const { error: updateError } = await supabase
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
          updated_at: new Date()
        })
        .eq('id', userId);
        
      if (updateError) throw updateError;
    } else {
      // Insert new profile
      const { error: insertError } = await supabase
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
        });
        
      if (insertError) throw insertError;
    }
    
    // Also save to localStorage as fallback
    localStorage.setItem('growvest_user_profile', JSON.stringify(profile));
    
    return profile;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    // First check if we have a logged in user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return null;
    }
    
    const userId = session.user.id;
    
    // Try to get profile from Supabase
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile from Supabase:', error);
      
      // Fallback to localStorage if Supabase fails
      const profileString = localStorage.getItem('growvest_user_profile');
      if (profileString) {
        return JSON.parse(profileString) as UserProfile;
      }
      
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Map Supabase data to UserProfile format
    const profile: UserProfile = {
      name: data.name,
      age: data.age,
      savings: data.savings,
      monthlyInvestmentCapacity: data.monthly_investment_capacity,
      relationshipStatus: data.relationship_status as UserProfile['relationshipStatus'],
      hasKids: data.has_kids as UserProfile['hasKids'],
      retirementAge: data.retirement_age,
      purchasePlans: data.purchase_plans as UserProfile['purchasePlans'],
      riskTolerance: data.risk_tolerance as UserProfile['riskTolerance'],
    };
    
    // Update localStorage with latest data
    localStorage.setItem('growvest_user_profile', JSON.stringify(profile));
    
    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
