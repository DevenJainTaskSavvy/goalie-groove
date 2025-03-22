
import { getUserProfile } from '../userService';
import { getGoals } from './goalCrud';

/**
 * Calculate remaining monthly investment capacity
 */
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
