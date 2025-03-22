
import React, { useState, useEffect } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Target, CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { calculateMonthlyContribution, formatCurrency, getRemainingMonthlyCapacity } from '@/services/api';
import { Goal, GoalCategory } from '@/types/finance';

const RISK_LEVELS = [
  { id: 'conservative', label: 'Conservative', description: 'Lower risk, lower returns (6% annually)' },
  { id: 'moderate', label: 'Moderate', description: 'Balanced risk and returns (10% annually)' },
  { id: 'aggressive', label: 'Aggressive', description: 'Higher risk, higher returns (14% annually)' }
];

interface EditGoalDialogProps {
  goal: Goal;
  onSave: (updatedGoal: Partial<Goal>) => void;
  onCancel: () => void;
}

const EditGoalDialog: React.FC<EditGoalDialogProps> = ({ goal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: goal.title,
    targetAmount: goal.targetAmount.toString(),
    currentAmount: goal.currentAmount.toString(),
    timeline: goal.timeline.toString(),
    riskLevel: goal.riskLevel,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingCapacity, setRemainingCapacity] = useState(0);
  const [calculatedContribution, setCalculatedContribution] = useState<number | null>(goal.monthlyContribution);
  
  useEffect(() => {
    // Fetch remaining monthly investment capacity plus current goal's contribution
    const fetchRemainingCapacity = async () => {
      try {
        const capacity = await getRemainingMonthlyCapacity();
        setRemainingCapacity(capacity + goal.monthlyContribution);
      } catch (error) {
        console.error('Failed to fetch remaining capacity:', error);
      }
    };
    
    fetchRemainingCapacity();
  }, [goal.monthlyContribution]);
  
  useEffect(() => {
    // Calculate monthly contribution when relevant fields change
    const calculate = () => {
      if (
        formData.targetAmount && 
        formData.currentAmount && 
        formData.timeline &&
        formData.riskLevel
      ) {
        const targetAmountNum = Number(formData.targetAmount);
        const currentAmountNum = Number(formData.currentAmount);
        const timelineYearsNum = Number(formData.timeline);
        
        if (targetAmountNum && currentAmountNum !== undefined && timelineYearsNum) {
          const monthlyAmount = calculateMonthlyContribution(
            targetAmountNum,
            currentAmountNum,
            timelineYearsNum,
            formData.riskLevel as 'conservative' | 'moderate' | 'aggressive'
          );
          
          setCalculatedContribution(monthlyAmount);
        }
      } else {
        setCalculatedContribution(null);
      }
    };
    
    calculate();
  }, [formData.targetAmount, formData.currentAmount, formData.timeline, formData.riskLevel]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRiskLevelSelect = (riskLevel: string) => {
    setFormData(prev => ({ ...prev, riskLevel }));
  };
  
  const handleSubmit = () => {
    if (!calculatedContribution) {
      return;
    }
    
    setIsSubmitting(true);
    
    const updatedGoal: Partial<Goal> = {
      id: goal.id,
      title: formData.title,
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount),
      timeline: Number(formData.timeline),
      riskLevel: formData.riskLevel as 'conservative' | 'moderate' | 'aggressive',
      monthlyContribution: calculatedContribution,
      // Calculate progress
      progress: Math.min(100, Math.round((Number(formData.currentAmount) / Number(formData.targetAmount)) * 100))
    };
    
    onSave(updatedGoal);
    setIsSubmitting(false);
  };
  
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Edit Goal</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="title">Goal Name</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="targetAmount">Target Amount (₹)</Label>
          <Input
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            className="mt-1"
            type="number"
          />
        </div>
        
        <div>
          <Label className="mb-3 block">Risk Level</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {RISK_LEVELS.map(({ id, label, description }) => (
              <button
                key={id}
                type="button"
                className={`relative p-3 rounded-lg border text-left transition-all ${
                  formData.riskLevel === id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50 bg-background/40'
                }`}
                onClick={() => handleRiskLevelSelect(id)}
              >
                <div>
                  <span className="block font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                  
                  {formData.riskLevel === id && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {calculatedContribution !== null && (
        <div className={`p-4 rounded-lg ${
          calculatedContribution > remainingCapacity
            ? 'bg-red-500/10 border border-red-500/20'
            : 'bg-green-500/10 border border-green-500/20'
        }`}>
          <div className="flex items-start">
            {calculatedContribution > remainingCapacity ? (
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            ) : (
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">
                {calculatedContribution > remainingCapacity
                  ? 'Exceeds your monthly capacity'
                  : 'Within your monthly capacity'}
              </p>
              <p className="text-sm mt-1">
                This goal requires <span className="font-semibold">{formatCurrency(calculatedContribution)}</span> monthly contribution.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit}
          disabled={isSubmitting || !calculatedContribution || calculatedContribution > remainingCapacity}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditGoalDialog;
