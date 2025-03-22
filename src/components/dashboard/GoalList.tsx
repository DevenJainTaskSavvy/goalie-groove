
import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, PlusCircle } from 'lucide-react';
import { Goal, GoalCategory } from '@/types/finance';
import GoalCard from '@/components/dashboard/GoalCard';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/services/api';

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
        />
      ))}
    </div>
  );
};

export default GoalList;
