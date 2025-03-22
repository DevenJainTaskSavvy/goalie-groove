
import { GoalCategory } from './finance';

export interface InvestmentCircle {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  targetDate: Date;
  createdBy: string;
  members: CircleMember[];
  category: GoalCategory;
}

export interface CircleMember {
  id: string;
  name: string;
  contribution: number;
  joinedAt: Date;
}
