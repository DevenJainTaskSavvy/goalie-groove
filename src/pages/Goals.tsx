
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import GoalCard from '@/components/dashboard/GoalCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, Loader2 } from 'lucide-react';
import { GoalCategory, Goal } from '@/types/finance';
import { getGoals, formatCurrency, deleteGoal, updateGoal } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import EditGoalDialog from '@/components/dashboard/EditGoalDialog';

const Goals = () => {
  const [filter, setFilter] = useState<GoalCategory | 'All'>('All');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const data = await getGoals();
        setGoals(data);
      } catch (error) {
        console.error('Failed to fetch goals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoals();
  }, []);
  
  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
      toast({
        title: "Goal deleted",
        description: "The goal has been successfully deleted.",
      });
    } catch (error) {
      console.error('Failed to delete goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete the goal. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setIsEditing(true);
    }
  };
  
  const handleUpdateGoal = async (updatedGoal: Partial<Goal>) => {
    try {
      const updated = await updateGoal(updatedGoal);
      setGoals(prevGoals => prevGoals.map(goal => 
        goal.id === updated.id ? updated : goal
      ));
      setIsEditing(false);
      setSelectedGoal(null);
      toast({
        title: "Goal updated",
        description: "The goal has been successfully updated.",
      });
    } catch (error) {
      console.error('Failed to update goal:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update the goal. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedGoal(null);
  };
  
  const filteredGoals = filter === 'All' 
    ? goals 
    : goals.filter(goal => goal.category === filter);
    
  const categories: (GoalCategory | 'All')[] = ['All', 'Retirement', 'Education', 'Housing', 'Vehicle', 'Travel', 'Other'];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container pt-24 px-4 mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <AnimatedText 
              text="Your Financial Goals" 
              element="h1"
              className="text-3xl font-bold mb-2" 
            />
            <p className="text-muted-foreground">Track and manage all your financial objectives</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex">
            <Link to="/goals/new">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Goal
              </Button>
            </Link>
          </div>
        </div>
        
        <GlassCard className="mb-8 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-5 w-5 mr-2 text-muted-foreground" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </GlassCard>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredGoals.length === 0 ? (
          <GlassCard className="text-center py-12">
            <p className="text-muted-foreground">No goals found in this category.</p>
            <Link to="/goals/new">
              <Button className="mt-4 gap-2">
                <PlusCircle className="h-4 w-4" />
                Create your first goal
              </Button>
            </Link>
          </GlassCard>
        ) : (
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
                onDelete={handleDeleteGoal}
                onEdit={handleEditGoal}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Edit Goal Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && handleCancelEdit()}>
        {selectedGoal && (
          <EditGoalDialog
            goal={selectedGoal}
            onSave={handleUpdateGoal}
            onCancel={handleCancelEdit}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Goals;
