
import { UserProfile } from '@/types/finance';

// Save or update user profile
export const saveUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    // Get current user
    const userString = localStorage.getItem('growvest_user');
    
    if (!userString) {
      throw new Error("Not authenticated");
    }
    
    // Save profile to localStorage
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
    const userString = localStorage.getItem('growvest_user');
    
    if (!userString) {
      return null;
    }
    
    const profileString = localStorage.getItem('growvest_user_profile');
    
    if (!profileString) {
      return null;
    }
    
    return JSON.parse(profileString) as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
