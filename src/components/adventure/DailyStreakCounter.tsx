
import React from 'react';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyStreakCounterProps {
  streak: number;
}

const DailyStreakCounter: React.FC<DailyStreakCounterProps> = ({ streak }) => {
  const streakDays = Array.from({ length: 7 }, (_, i) => i < streak);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className={cn(
              "absolute inset-0 bg-orange-500/20 rounded-full", 
              streak > 0 && "animate-pulse-soft"
            )}></div>
            <div className="relative bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center">
              <Flame className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Daily Streak</h3>
            <p className="text-muted-foreground text-sm">Keep the flame alive!</p>
          </div>
        </div>
        
        <div className="bg-secondary/30 backdrop-blur-sm py-1 px-3 rounded-full flex items-center gap-1">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium">{streak} days</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center gap-2 mt-4">
        {streakDays.map((isActive, index) => (
          <div 
            key={index} 
            className={cn(
              "w-full h-10 rounded-md flex items-center justify-center transition-all duration-300",
              isActive 
                ? "bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 shadow-lg" 
                : "bg-secondary/30"
            )}
          >
            <Calendar className={cn(
              "h-5 w-5",
              isActive ? "text-white" : "text-muted-foreground"
            )} />
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          {streak > 0 
            ? `You're on fire! ${streak} day streak! 🔥` 
            : "Start your streak today! 👀"}
        </p>
      </div>
    </div>
  );
};

export default DailyStreakCounter;
