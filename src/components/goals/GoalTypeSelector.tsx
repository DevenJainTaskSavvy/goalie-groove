
import React from 'react';
import { Check } from 'lucide-react';
import { GoalCategory } from '@/types/finance';
import { MICRO_GOAL_TYPES, MACRO_GOAL_TYPES } from '@/components/goals/goalConstants';

interface GoalTypeSelectorProps {
  goalSize: 'micro' | 'macro';
  selectedType: string;
  onSelect: (goalType: string) => void;
}

const GoalTypeSelector: React.FC<GoalTypeSelectorProps> = ({ 
  goalSize, 
  selectedType, 
  onSelect 
}) => {
  const currentGoalTypes = goalSize === 'micro' ? MICRO_GOAL_TYPES : MACRO_GOAL_TYPES;
  
  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {currentGoalTypes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`relative p-4 rounded-lg border transition-all ${
              selectedType === id 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50 bg-background/40'
            }`}
            onClick={() => onSelect(id)}
          >
            <div className="flex flex-col items-center">
              <Icon className="h-6 w-6 mb-2 text-primary/80" />
              <span>{label}</span>
              
              {selectedType === id && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GoalTypeSelector;
