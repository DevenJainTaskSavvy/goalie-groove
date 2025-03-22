
import React from 'react';
import { Info, Zap } from 'lucide-react';
import { formatCurrency } from '@/services/api';
import { Progress } from '@/components/ui/progress';

interface RemainingCapacityInfoProps {
  remainingCapacity: number;
  monthlyCapacity?: number;
}

const RemainingCapacityInfo: React.FC<RemainingCapacityInfoProps> = ({ 
  remainingCapacity,
  monthlyCapacity = 0
}) => {
  // Calculate percentage used
  const percentageUsed = monthlyCapacity ? Math.max(0, Math.min(100, 100 - (remainingCapacity / monthlyCapacity * 100))) : 0;
  
  // Get message based on usage
  const getMessage = () => {
    if (percentageUsed > 90) return "Almost maxed out! Choose wisely! 👀";
    if (percentageUsed > 70) return "Getting tight! Still some room to flex! 💪";
    if (percentageUsed > 40) return "Good balance! Smart moves! 🔥";
    return "Lots of capacity! Time to level up those goals! 🚀";
  };
  
  return (
    <div className="flex flex-col p-4 mb-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
      <div className="flex items-center mb-2">
        <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
        <div>
          <p className="text-sm">Your remaining monthly investment capacity: <span className="font-semibold">{formatCurrency(remainingCapacity)}</span></p>
        </div>
      </div>
      
      {monthlyCapacity > 0 && (
        <div className="mt-2 space-y-1">
          <Progress 
            value={percentageUsed} 
            className="h-2"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{percentageUsed.toFixed(0)}% allocated</span>
            <span className="flex items-center gap-1 text-primary">
              <Zap className="h-3 w-3" /> {getMessage()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemainingCapacityInfo;
