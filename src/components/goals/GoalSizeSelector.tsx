
import React from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Coins } from 'lucide-react';

interface GoalSizeSelectorProps {
  goalSize: 'micro' | 'macro';
  onSelectGoalSize: (size: 'micro' | 'macro') => void;
}

const GoalSizeSelector: React.FC<GoalSizeSelectorProps> = ({ 
  goalSize, 
  onSelectGoalSize 
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <p className="text-sm text-muted-foreground">Choose your goal size:</p>
      <div className="flex justify-center gap-4 max-w-md mx-auto">
        <Button
          type="button"
          variant={goalSize === 'micro' ? "default" : "outline"}
          onClick={() => onSelectGoalSize('micro')}
          className={`flex items-center justify-center gap-2 py-6 flex-1 ${goalSize === 'micro' ? 'ring-2 ring-primary/50' : ''}`}
        >
          <Coins className="h-5 w-5" />
          <div className="flex flex-col items-start">
            <span className="font-bold">Micro Goal</span>
            <span className="text-xs text-left">Small wins, quick gains</span>
          </div>
        </Button>
        <Button
          type="button"
          variant={goalSize === 'macro' ? "default" : "outline"}
          onClick={() => onSelectGoalSize('macro')}
          className={`flex items-center justify-center gap-2 py-6 flex-1 ${goalSize === 'macro' ? 'ring-2 ring-primary/50' : ''}`}
        >
          <Rocket className="h-5 w-5" />
          <div className="flex flex-col items-start">
            <span className="font-bold">Macro Goal</span>
            <span className="text-xs text-left">Major flex, big future</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default GoalSizeSelector;
