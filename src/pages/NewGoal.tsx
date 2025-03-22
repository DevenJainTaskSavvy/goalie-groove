
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import { Check, Target, CreditCard, Calendar, Info, AlertTriangle, Plane, Smartphone, ShoppingBag } from 'lucide-react';
import { Goal, GoalCategory } from '@/types/finance';
import { addGoal, calculateMonthlyContribution, formatCurrency, getUserProfile, getRemainingMonthlyCapacity } from '@/services/api';
import { MICRO_GOAL_THRESHOLD } from '@/components/dashboard/goalUtils';

// Goal types based on size
const MICRO_GOAL_TYPES = [
  { id: 'travel', label: 'Travel', icon: Plane, category: 'Travel' as GoalCategory },
  { id: 'electronics', label: 'Electronics', icon: Smartphone, category: 'Electronics' as GoalCategory },
  { id: 'accessories', label: 'Accessories', icon: ShoppingBag, category: 'Accessories' as GoalCategory },
  { id: 'other', label: 'Other', icon: Target, category: 'Other' as GoalCategory },
];

const MACRO_GOAL_TYPES = [
  { id: 'retirement', label: 'Retirement', icon: Calendar, category: 'Retirement' as GoalCategory },
  { id: 'education', label: 'Education', icon: Target, category: 'Education' as GoalCategory },
  { id: 'housing', label: 'Housing', icon: CreditCard, category: 'Housing' as GoalCategory },
  { id: 'vehicle', label: 'Vehicle', icon: Target, category: 'Vehicle' as GoalCategory },
  { id: 'other', label: 'Other', icon: Target, category: 'Other' as GoalCategory },
];

const RISK_LEVELS = [
  { id: 'conservative', label: 'Conservative', description: 'Lower risk, lower returns (6% annually)' },
  { id: 'moderate', label: 'Moderate', description: 'Balanced risk and returns (10% annually)' },
  { id: 'aggressive', label: 'Aggressive', description: 'Higher risk, higher returns (14% annually)' }
];

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
  
  // Get the current goal types based on the goal size
  const currentGoalTypes = goalSize === 'micro' ? MICRO_GOAL_TYPES : MACRO_GOAL_TYPES;
  
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {currentGoalTypes.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      className={`relative p-4 rounded-lg border transition-all ${
                        formData.goalType === id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50 bg-background/40'
                      }`}
                      onClick={() => handleGoalTypeSelect(id)}
                    >
                      <div className="flex flex-col items-center">
                        <Icon className="h-6 w-6 mb-2 text-primary/80" />
                        <span>{label}</span>
                        
                        {formData.goalType === id && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    name="goalName"
                    value={formData.goalName}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    placeholder="e.g., 10"
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
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details about your goal..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
              
              {calculatedContribution !== null && (
                <div className={`mt-6 p-4 rounded-lg ${
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
                      {calculatedContribution > remainingCapacity && (
                        <p className="text-sm mt-1 text-red-500">
                          You need to reduce your target amount or extend your timeline.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
