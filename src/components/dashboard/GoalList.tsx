
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, PlusCircle } from 'lucide-react';
import { Goal, GoalCategory } from '@/types/finance';
import GoalCard from '@/components/dashboard/GoalCard';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/services/api';
import { addGoal, updateGoal } from '@/services/goalService';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface GoalListProps {
  loading: boolean;
  goals: Goal[];
  goalSizeTab: 'micro' | 'macro';
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const GoalList: React.FC<GoalListProps> = ({
  loading,
  goals,
  goalSizeTab,
  onDelete,
  onEdit,
}) => {
  const { toast } = useToast();
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [sourceGoal, setSourceGoal] = useState<Goal | null>(null);
  const [targetGoalId, setTargetGoalId] = useState<string>('');
  const [showRebalanceDialog, setShowRebalanceDialog] = useState(false);
  const [rebalanceAmount, setRebalanceAmount] = useState<string>('');
  const [maxRebalanceAmount, setMaxRebalanceAmount] = useState<number>(0);

  useEffect(() => {
    // Filter out any goals that are loans (have "Loan for" in the title)
    const nonLoanGoals = goals.filter(
      goal => !goal.title.startsWith('Loan for')
    );
    setFilteredGoals(nonLoanGoals);
  }, [goals]);

  const handleFinanceGoal = async (goalId: string, goalTitle: string, remainingAmount: number) => {
    try {
      // Get the original goal to reference its data
      const originalGoal = goals.find(goal => goal.id === goalId);
      
      if (!originalGoal) {
        toast({
          title: "Error",
          description: "Goal not found",
          variant: "destructive"
        });
        return;
      }
      
      // Create a new loan goal based on the original goal
      const loanGoal: Omit<Goal, 'id' | 'progress'> = {
        title: `Loan for ${goalTitle}`,
        targetAmount: remainingAmount,
        currentAmount: 0,
        timeline: 2, // Default timeline of 2 years for loans
        category: "Other" as any,
        monthlyContribution: remainingAmount / 24, // Monthly payment for 2 years
        riskLevel: "conservative",
        description: `Loan taken to finance ${goalTitle}`
      };
      
      // Add the loan goal to the database
      await addGoal(loanGoal);
      
      // Mark the original goal as completed (set currentAmount to targetAmount)
      await updateGoal({
        id: goalId,
        currentAmount: originalGoal.targetAmount,
        progress: 100
      });
      
      // Show success message
      toast({
        title: "Financing Applied",
        description: `Your goal "${goalTitle}" has been financed and a new loan goal has been created.`,
      });
      
      // Refresh the page to show the updated goals
      window.location.reload();
      
    } catch (error) {
      console.error("Error financing goal:", error);
      toast({
        title: "Error",
        description: "Failed to finance goal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const initiateRebalance = (goalId: string, goalTitle: string, currentAmountValue: number) => {
    const goal = filteredGoals.find(g => g.id === goalId);
    if (!goal) return;
    
    setSourceGoal(goal);
    setMaxRebalanceAmount(currentAmountValue);
    setRebalanceAmount(currentAmountValue.toString());
    setShowRebalanceDialog(true);
  };

  const handleRebalanceConfirm = async () => {
    try {
      if (!sourceGoal || !targetGoalId) {
        toast({
          title: "Error",
          description: "Please select a goal to transfer funds to",
          variant: "destructive"
        });
        return;
      }

      const amount = parseFloat(rebalanceAmount);
      if (isNaN(amount) || amount <= 0 || amount > maxRebalanceAmount) {
        toast({
          title: "Error",
          description: `Please enter a valid amount between 1 and ${maxRebalanceAmount}`,
          variant: "destructive"
        });
        return;
      }

      const targetGoal = filteredGoals.find(g => g.id === targetGoalId);
      if (!targetGoal) {
        toast({
          title: "Error",
          description: "Target goal not found",
          variant: "destructive"
        });
        return;
      }

      // Update source goal - reduce current amount
      await updateGoal({
        id: sourceGoal.id,
        currentAmount: sourceGoal.currentAmount - amount
      });

      // Update target goal - increase current amount
      await updateGoal({
        id: targetGoalId,
        currentAmount: targetGoal.currentAmount + amount
      });

      // Show success message
      toast({
        title: "Rebalance Successful",
        description: `₹${amount.toFixed(2)} moved from "${sourceGoal.title}" to "${targetGoal.title}"`,
      });

      // Reset states
      setShowRebalanceDialog(false);
      setSourceGoal(null);
      setTargetGoalId('');
      setRebalanceAmount('');

      // Refresh the page to show the updated goals
      window.location.reload();
    } catch (error) {
      console.error("Error rebalancing goals:", error);
      toast({
        title: "Error",
        description: "Failed to rebalance goals. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (filteredGoals.length === 0) {
    return (
      <GlassCard className="text-center py-12">
        <p className="text-muted-foreground">
          {goalSizeTab === 'micro' 
            ? "No micro goals found in this category." 
            : "No macro goals found in this category."}
        </p>
        <Link to="/goals/new">
          <Button className="mt-4 gap-2">
            <PlusCircle className="h-4 w-4" />
            Create your first {goalSizeTab} goal
          </Button>
        </Link>
      </GlassCard>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => (
          <GoalCard 
            key={goal.id}
            id={goal.id}
            title={goal.title}
            targetAmount={formatCurrency(goal.targetAmount)}
            currentAmount={formatCurrency(goal.currentAmount)}
            timeline={`${goal.timeline} years`}
            progress={goal.progress}
            category={goal.category}
            onDelete={onDelete}
            onEdit={onEdit}
            onFinance={handleFinanceGoal}
            onRebalance={initiateRebalance}
            isMicroGoal={goalSizeTab === 'micro'}
          />
        ))}
      </div>

      {/* Rebalance Dialog */}
      <Dialog open={showRebalanceDialog} onOpenChange={setShowRebalanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rebalance Your Goals</DialogTitle>
            <DialogDescription>
              Move funds from "{sourceGoal?.title}" to another goal. 
              Maximum amount available: ₹{maxRebalanceAmount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to transfer</Label>
              <Input 
                id="amount"
                type="number" 
                min="1" 
                max={maxRebalanceAmount}
                value={rebalanceAmount}
                onChange={(e) => setRebalanceAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Select goal to transfer to</Label>
              <RadioGroup value={targetGoalId} onValueChange={setTargetGoalId}>
                {filteredGoals
                  .filter(goal => goal.id !== sourceGoal?.id)
                  .map(goal => (
                    <div key={goal.id} className="flex items-center space-x-2 border p-2 rounded my-1">
                      <RadioGroupItem value={goal.id} id={goal.id} />
                      <Label htmlFor={goal.id} className="flex-1">
                        {goal.title} (Current: {formatCurrency(goal.currentAmount)})
                      </Label>
                    </div>
                  ))
                }
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRebalanceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRebalanceConfirm}>
              Confirm Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalList;
