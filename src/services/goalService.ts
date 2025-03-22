
// Re-export all goal-related services from their respective files
export { addGoal, getGoals, deleteGoal } from './goals/goalCrud';
export { updateGoal } from './goals/goalUpdate';
export { getRemainingMonthlyCapacity } from './goals/goalAnalytics';
export { mapToGoal } from './goals/goalMappers';
