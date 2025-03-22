
import React from 'react';
import { Button } from '@/components/ui/button';

interface GoalSizeSelectorProps {
  goalSize: 'micro' | 'macro';
  onSelectGoalSize: (size: 'micro' | 'macro') => void;
}

const GoalSizeSelector: React.FC<GoalSizeSelectorProps> = ({ 
  goalSize, 
  onSelectGoalSize 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        type="button"
        variant={goalSize === 'micro' ? "default" : "outline"}
        onClick={() => onSelectGoalSize('micro')}
      >
        Micro Goal
      </Button>
      <Button
        type="button"
        variant={goalSize === 'macro' ? "default" : "outline"}
        onClick={() => onSelectGoalSize('macro')}
      >
        Macro Goal
      </Button>
    </div>
  );
};

export default GoalSizeSelector;
