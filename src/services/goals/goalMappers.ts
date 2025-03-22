
import { Goal } from '@/types/finance';

/**
 * Maps database fields to the Goal type
 */
export const mapToGoal = (data: any): Goal => {
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
