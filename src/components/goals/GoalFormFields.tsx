
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface GoalFormFieldsProps {
  formData: {
    goalName: string;
    targetAmount: string;
    currentAmount: string;
    timeline: string;
    description: string;
  };
  goalSize: 'micro' | 'macro';
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GoalFormFields: React.FC<GoalFormFieldsProps> = ({
  formData,
  goalSize,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="goalName">Goal Name</Label>
        <Input
          id="goalName"
          name="goalName"
          value={formData.goalName}
          onChange={onChange}
          placeholder="e.g., Retirement Fund, Dream Home"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="targetAmount">Target Amount (₹)</Label>
        <Input
          id="targetAmount"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={onChange}
          placeholder={goalSize === 'micro' ? "e.g., 100000 (under 5,00,000)" : "e.g., 5000000 (5,00,000 or more)"}
          className="mt-1"
          type="number"
        />
      </div>
      
      <div>
        <Label htmlFor="currentAmount">Current Amount (₹)</Label>
        <Input
          id="currentAmount"
          name="currentAmount"
          value={formData.currentAmount}
          onChange={onChange}
          placeholder="e.g., 100000"
          className="mt-1"
          type="number"
        />
      </div>
      
      <div>
        <Label htmlFor="timeline">Timeline (years)</Label>
        <Input
          id="timeline"
          name="timeline"
          value={formData.timeline}
          onChange={onChange}
          placeholder="e.g., 10"
          className="mt-1"
          type="number"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Add details about your goal..."
          className="mt-1"
          rows={3}
        />
      </div>
    </div>
  );
};

export default GoalFormFields;
