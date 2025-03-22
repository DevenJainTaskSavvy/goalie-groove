
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import { Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { GoalCategory } from '@/types/finance';
import { addGoal, calculateMonthlyContribution, formatCurrency, getRemainingMonthlyCapacity } from '@/services/api';
import { MICRO_GOAL_THRESHOLD } from '@/components/dashboard/goalUtils';

// Import our new components
import GoalTypeSelector from '@/components/goals/GoalTypeSelector';
import RiskLevelSelector from '@/components/goals/RiskLevelSelector';
import GoalContributionInfo from '@/components/goals/GoalContributionInfo';
import GoalFormFields from '@/components/goals/GoalFormFields';
import { MICRO_GOAL_TYPES, MACRO_GOAL_TYPES } from '@/components/goals/goalConstants';

const NewGoal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingCapacity, setRemainingCapacity] = useState(0);
  
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
        description: formData.description
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
    <div className="min-h-screen bg-background pt-16">
      <Header />
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <AnimatedText 
              text={`Create a New ${goalSize === 'micro' ? 'Micro' : 'Macro'} Goal`}
              element="h1"
              className="text-3xl font-bold mb-2"
              variant="gradient"
            />
            <p className="text-muted-foreground">
              {goalSize === 'micro' 
                ? 'Define smaller financial goals under ₹5,00,000 to track progress towards immediate needs.' 
                : 'Define larger financial goals over ₹5,00,000 to track progress towards major life milestones.'}
            </p>
          </div>
          
          <div className="flex items-center p-4 mb-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm">Your remaining monthly investment capacity: <span className="font-semibold">{formatCurrency(remainingCapacity)}</span></p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <Button
              type="button"
              variant={goalSize === 'micro' ? "default" : "outline"}
              onClick={() => {
                setGoalSize('micro');
                setFormData(prev => ({ ...prev, goalType: '', targetAmount: '' }));
              }}
            >
              Micro Goal
            </Button>
            <Button
              type="button"
              variant={goalSize === 'macro' ? "default" : "outline"}
              onClick={() => {
                setGoalSize('macro');
                setFormData(prev => ({ ...prev, goalType: '', targetAmount: '' }));
              }}
            >
              Macro Goal
            </Button>
          </div>
          
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
        </div>
      </main>
    </div>
  );
};

export default NewGoal;
