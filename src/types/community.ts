
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

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
}

export interface ActivityEvent {
  id: string;
  type: 'contribution' | 'member_joined' | 'target_updated' | 'circle_created' | 'milestone_reached';
  userId: string;
  circleId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}
