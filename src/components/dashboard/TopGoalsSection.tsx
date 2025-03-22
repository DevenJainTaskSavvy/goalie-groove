
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Goal } from '@/types/finance';
import GoalCard from '@/components/dashboard/GoalCard';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/services/api';
import { addGoal } from '@/services/goalService';
import { useToast } from '@/hooks/use-toast';

interface TopGoalsSectionProps {
  goals: Goal[];
  onDeleteGoal: (id: string) => void;
  onEditGoal: (id: string) => void;
}

const TopGoalsSection: React.FC<TopGoalsSectionProps> = ({
  goals,
  onDeleteGoal,
  onEditGoal
}) => {
  const { toast } = useToast();

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

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Financial Goals</h2>
        <Link to="/goals" className="text-sm text-primary hover:underline">View all</Link>
      </div>
      
      {goals.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-muted-foreground">You haven't created any goals yet.</p>
          <Link to="/goals/new">
            <Button className="mt-4 gap-2">
              <PlusCircle className="h-4 w-4" />
              Create your first goal
            </Button>
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard 
              key={goal.id}
              id={goal.id}
              title={goal.title}
              targetAmount={formatCurrency(goal.targetAmount)}
              currentAmount={formatCurrency(goal.currentAmount)}
              timeline={`${goal.timeline} years`}
              progress={goal.progress}
              category={goal.category}
              onDelete={onDeleteGoal}
              onEdit={onEditGoal}
              onFinance={handleFinanceGoal}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TopGoalsSection;
