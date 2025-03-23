
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { ArrowUp, Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserLevelProgressProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

const UserLevelProgress: React.FC<UserLevelProgressProps> = ({ 
  currentXP, 
  nextLevelXP, 
  level 
}) => {
  const progress = Math.round((currentXP / nextLevelXP) * 100);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-soft"></div>
            <div className="relative bg-primary rounded-full w-10 h-10 flex items-center justify-center">
              <Award className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Level {level}</h3>
            <p className="text-muted-foreground text-sm">Finance Wizard</p>
          </div>
        </div>
        <div className="bg-secondary/30 backdrop-blur-sm py-1 px-3 rounded-full flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium">{currentXP} XP</span>
        </div>
      </div>
      
      <div className="mb-2">
        <Progress value={progress} className="h-3" />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Current: {currentXP} XP</span>
        <div className="flex items-center gap-1">
          <ArrowUp className="h-3 w-3 text-primary" />
          <span>Next Level: {nextLevelXP} XP</span>
        </div>
      </div>
    </div>
  );
};

export default UserLevelProgress;
