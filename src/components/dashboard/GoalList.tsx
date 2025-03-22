
import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, PlusCircle } from 'lucide-react';
import { Goal, GoalCategory } from '@/types/finance';
import GoalCard from '@/components/dashboard/GoalCard';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/services/api';
import { addGoal } from '@/services/goalService';
import { useToast } from '@/hooks/use-toast';

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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (goals.length === 0) {
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
          onDelete={onDelete}
          onEdit={onEdit}
          onFinance={handleFinanceGoal}
        />
      ))}
    </div>
  );
};

export default GoalList;
