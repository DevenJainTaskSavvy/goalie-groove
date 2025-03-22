
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GoalCategory, Goal } from '@/types/finance';
import { getGoals, deleteGoal, updateGoal } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Dialog } from '@/components/ui/dialog';
import EditGoalDialog from '@/components/dashboard/EditGoalDialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoalFilters from '@/components/dashboard/GoalFilters';
import GoalList from '@/components/dashboard/GoalList';
import { getFilteredGoals, microCategories, macroCategories } from '@/components/dashboard/goalUtils';

const Goals = () => {
  const [filter, setFilter] = useState<GoalCategory | 'All'>('All');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalSizeTab, setGoalSizeTab] = useState<'micro' | 'macro'>('micro');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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
  
  // Get the appropriate categories based on the current tab
  const currentCategories = goalSizeTab === 'micro' ? microCategories : macroCategories;
  
  // Get filtered and sorted goals
  const filteredGoals = getFilteredGoals(goals, goalSizeTab, filter, sortOrder);
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };
  
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
        
        {/* Goal Size Tabs */}
        <div className="mb-6">
          <Tabs defaultValue="micro" onValueChange={(value) => setGoalSizeTab(value as 'micro' | 'macro')}>
            <TabsList className="w-full max-w-[300px] mx-auto grid grid-cols-2">
              <TabsTrigger value="micro">Micro</TabsTrigger>
              <TabsTrigger value="macro">Macro</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Goal Filters */}
        <GoalFilters
          filter={filter}
          setFilter={setFilter}
          categories={currentCategories}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
        />
        
        {/* Goal List */}
        <GoalList
          loading={loading}
          goals={filteredGoals}
          goalSizeTab={goalSizeTab}
          onDelete={handleDeleteGoal}
          onEdit={handleEditGoal}
        />
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
