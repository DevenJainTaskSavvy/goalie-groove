
import { UserProfile } from '@/types/finance';

// In-memory storage for user profile
let userData: UserProfile | null = null;

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
