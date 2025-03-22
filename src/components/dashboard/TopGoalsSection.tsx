
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Goal } from '@/types/finance';
import GoalCard from '@/components/dashboard/GoalCard';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/services/api';

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
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TopGoalsSection;
