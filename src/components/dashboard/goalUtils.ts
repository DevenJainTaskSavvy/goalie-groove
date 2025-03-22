
import { Goal, GoalCategory } from '@/types/finance';

// Threshold for micro vs macro goals (₹5,00,000)
export const MICRO_GOAL_THRESHOLD = 500000;

// Different categories for micro and macro goals
export const microCategories: (GoalCategory | 'All')[] = ['All', 'Travel', 'Electronics', 'Accessories', 'Other'];
export const macroCategories: (GoalCategory | 'All')[] = ['All', 'Retirement', 'Education', 'Housing', 'Vehicle', 'Other'];

// Filter and sort goals based on size, category and sort order
export const getFilteredGoals = (
  goals: Goal[],
  goalSizeTab: 'micro' | 'macro',
  filter: GoalCategory | 'All',
  sortOrder: 'asc' | 'desc'
): Goal[] => {
  // Get micro or macro goals
  const goalsBySize = goalSizeTab === 'micro' 
    ? goals.filter(goal => goal.targetAmount < MICRO_GOAL_THRESHOLD) 
    : goals.filter(goal => goal.targetAmount >= MICRO_GOAL_THRESHOLD);
  
  // Apply category filter
  const filteredGoals = filter === 'All' 
    ? goalsBySize 
    : goalsBySize.filter(goal => goal.category === filter);
  
  // Sort by amount left to achieve (target - current)
  return filteredGoals.sort((a, b) => {
    const aRemaining = a.targetAmount - a.currentAmount;
    const bRemaining = b.targetAmount - b.currentAmount;
    return sortOrder === 'desc' ? bRemaining - aRemaining : aRemaining - bRemaining;
  });
};

// Get appropriate categories based on goal size
export const getCategoriesForGoalSize = (goalSize: 'micro' | 'macro'): GoalCategory[] => {
  if (goalSize === 'micro') {
    return ['Travel', 'Electronics', 'Accessories', 'Other'];
  } else {
    return ['Retirement', 'Education', 'Housing', 'Vehicle', 'Other'];
  }
};
