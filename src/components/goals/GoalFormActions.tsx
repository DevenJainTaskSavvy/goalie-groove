
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface GoalFormActionsProps {
  isSubmitting: boolean;
  calculatedContribution: number | null;
  remainingCapacity: number;
}

const GoalFormActions: React.FC<GoalFormActionsProps> = ({ 
  isSubmitting, 
  calculatedContribution, 
  remainingCapacity 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate('/goals')}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || (calculatedContribution !== null && calculatedContribution > remainingCapacity)}
      >
        Create Goal
      </Button>
    </div>
  );
};

export default GoalFormActions;
