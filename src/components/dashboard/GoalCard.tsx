
import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { Target, TrendingUp, CalendarClock } from 'lucide-react';

interface GoalCardProps {
  title: string;
  targetAmount: string;
  currentAmount: string;
  timeline: string;
  progress: number;
  category: 'Retirement' | 'Education' | 'Housing' | 'Vehicle' | 'Travel' | 'Other';
}

const GoalCard = ({
  title,
  targetAmount,
  currentAmount,
  timeline,
  progress,
  category,
}: GoalCardProps) => {
  
  const categoryIcons = {
    Retirement: <CalendarClock className="h-5 w-5 text-purple-400" />,
    Education: <TrendingUp className="h-5 w-5 text-blue-400" />,
    Housing: <Target className="h-5 w-5 text-emerald-400" />,
    Vehicle: <Target className="h-5 w-5 text-amber-400" />,
    Travel: <Target className="h-5 w-5 text-rose-400" />,
    Other: <Target className="h-5 w-5 text-gray-400" />,
  };

  return (
    <GlassCard className="hover:translate-y-[-4px] transition-transform duration-300">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary mr-3">
              {categoryIcons[category]}
            </span>
            <h3 className="font-medium text-lg">{title}</h3>
          </div>
          <span className="text-xs py-1 px-2 rounded-full bg-secondary/50 text-muted-foreground">
            {category}
          </span>
        </div>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Target</span>
            <span className="font-medium">{targetAmount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Current</span>
            <span className="font-medium">{currentAmount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Timeline</span>
            <span className="font-medium">{timeline}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                progress >= 75 ? "bg-emerald-500" : 
                progress >= 50 ? "bg-amber-500" : 
                progress >= 25 ? "bg-orange-500" : 
                "bg-rose-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default GoalCard;
