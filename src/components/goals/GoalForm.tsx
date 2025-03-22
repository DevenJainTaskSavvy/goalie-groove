import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import GlassCard from '@/components/ui/GlassCard';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { addGoal, calculateMonthlyContribution, formatCurrency, getRemainingMonthlyCapacity } from '@/services/api';
import { MICRO_GOAL_THRESHOLD } from '@/components/dashboard/goalUtils';

// Import our components
import GoalTypeSelector from '@/components/goals/GoalTypeSelector';
import RiskLevelSelector from '@/components/goals/RiskLevelSelector';
import GoalContributionInfo from '@/components/goals/GoalContributionInfo';
import GoalFormFields from '@/components/goals/GoalFormFields';
import GoalSizeSelector from '@/components/goals/GoalSizeSelector';
import RemainingCapacityInfo from '@/components/goals/RemainingCapacityInfo';
import { MICRO_GOAL_TYPES, MACRO_GOAL_TYPES } from '@/components/goals/goalConstants';

const GoalForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingCapacity, setRemainingCapacity] = useState(0);
  const [autoDebit, setAutoDebit] = useState(false);
  
  // Add goalSize state to track micro vs macro
  const [goalSize, setGoalSize] = useState<'micro' | 'macro'>('micro');
  
  const [formData, setFormData] = useState({
    goalType: '',
    goalName: '',
    targetAmount: '',
    currentAmount: '',
    timeline: '',
    description: '',
    riskLevel: 'moderate'
  });
  
  const [calculatedContribution, setCalculatedContribution] = useState<number | null>(null);
  
  useEffect(() => {
    // Fetch remaining monthly investment capacity
    const fetchRemainingCapacity = async () => {
      try {
        const capacity = await getRemainingMonthlyCapacity();
        setRemainingCapacity(capacity);
      } catch (error) {
        console.error('Failed to fetch remaining capacity:', error);
      }
    };
    
    fetchRemainingCapacity();
  }, []);
  
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
        
        // Update goal size based on target amount
        if (targetAmountNum < MICRO_GOAL_THRESHOLD) {
          setGoalSize('micro');
        } else {
          setGoalSize('macro');
        }
        
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If changing target amount, check if we need to switch goal size
    if (name === 'targetAmount') {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        if (numValue < MICRO_GOAL_THRESHOLD) {
          setGoalSize('micro');
          // Clear goal type if switching sizes
          if (goalSize !== 'micro') {
            setFormData(prev => ({ ...prev, goalType: '' }));
          }
        } else {
          setGoalSize('macro');
          // Clear goal type if switching sizes
          if (goalSize !== 'macro') {
            setFormData(prev => ({ ...prev, goalType: '' }));
          }
        }
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGoalTypeSelect = (goalType: string) => {
    setFormData(prev => ({ ...prev, goalType }));
  };
  
  const handleRiskLevelSelect = (riskLevel: string) => {
    setFormData(prev => ({ ...prev, riskLevel }));
  };
  
  const handleGoalSizeSelect = (size: 'micro' | 'macro') => {
    setGoalSize(size);
    setFormData(prev => ({ ...prev, goalType: '' }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.goalType || !formData.goalName || !formData.targetAmount || !formData.timeline) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (!calculatedContribution) {
      toast({
        title: "Calculation error",
        description: "Unable to calculate monthly contribution. Please check your inputs.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if monthly contribution exceeds remaining capacity
    if (calculatedContribution > remainingCapacity) {
      toast({
        title: "Exceeds investment capacity",
        description: `This goal requires ${formatCurrency(calculatedContribution)} monthly, but you only have ${formatCurrency(remainingCapacity)} available.`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Find the category based on the selected goal type
      const goalTypes = goalSize === 'micro' ? MICRO_GOAL_TYPES : MACRO_GOAL_TYPES;
      const selectedGoalType = goalTypes.find(type => type.id === formData.goalType);
      
      if (!selectedGoalType) {
        throw new Error("Invalid goal type");
      }
      
      // Prepare goal data
      const goalData = {
        title: formData.goalName,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount) || 0,
        timeline: Number(formData.timeline),
        category: selectedGoalType.category,
        monthlyContribution: calculatedContribution,
        riskLevel: formData.riskLevel as 'conservative' | 'moderate' | 'aggressive',
        description: formData.description,
        autoDebit: autoDebit
      };
      
      // Add the goal
      await addGoal(goalData);
      
      toast({
        title: "Goal created!",
        description: "Your new financial goal has been added.",
      });
      
      // Navigate back to goals list
      navigate('/goals');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create goal. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <RemainingCapacityInfo remainingCapacity={remainingCapacity} />
      
      <GoalSizeSelector 
        goalSize={goalSize} 
        onSelectGoalSize={handleGoalSizeSelect} 
      />
      
      <form onSubmit={handleSubmit}>
        <GlassCard className="mb-6">
          <div className="mb-6">
            <Label className="mb-3 block">Select Goal Type</Label>
            <GoalTypeSelector 
              goalSize={goalSize}
              selectedType={formData.goalType}
              onSelect={handleGoalTypeSelect}
            />
          </div>
          
          <GoalFormFields 
            formData={formData}
            goalSize={goalSize}
            onChange={handleChange}
          />
          
          <div className="mt-6">
            <RiskLevelSelector 
              selectedRiskLevel={formData.riskLevel}
              onSelect={handleRiskLevelSelect}
            />
          </div>
          
          <div className="mt-6 flex items-center space-x-2">
            <Checkbox 
              id="autoDebit" 
              checked={autoDebit}
              onCheckedChange={(checked) => setAutoDebit(checked === true)}
            />
            <label
              htmlFor="autoDebit"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Enable Auto-Debit - Never miss a deadline! Stay on top of your financial goals!
            </label>
          </div>
          
          <GoalContributionInfo 
            calculatedContribution={calculatedContribution}
            remainingCapacity={remainingCapacity}
          />
        </GlassCard>
        
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
      </form>
    </>
  );
};

export default GoalForm;
