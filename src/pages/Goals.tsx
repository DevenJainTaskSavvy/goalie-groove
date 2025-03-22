
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import GoalCard from '@/components/dashboard/GoalCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, Loader2, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { GoalCategory, Goal } from '@/types/finance';
import { getGoals, formatCurrency, deleteGoal, updateGoal } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import EditGoalDialog from '@/components/dashboard/EditGoalDialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  
  // Consider goals with target amount less than 5,00,000 as micro goals
  const MICRO_GOAL_THRESHOLD = 500000;
  
  const microGoals = goals.filter(goal => goal.targetAmount < MICRO_GOAL_THRESHOLD);
  const macroGoals = goals.filter(goal => goal.targetAmount >= MICRO_GOAL_THRESHOLD);
  
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
  
  // Different categories for micro and macro goals
  const microCategories: (GoalCategory | 'All')[] = ['All', 'Travel', 'Electronics', 'Accessories', 'Other'];
  const macroCategories: (GoalCategory | 'All')[] = ['All', 'Retirement', 'Education', 'Housing', 'Vehicle', 'Other'];
  
  // Get the appropriate goals based on the current tab, filter, and sort order
  const getFilteredGoals = () => {
    const goalsBySize = goalSizeTab === 'micro' ? microGoals : macroGoals;
    const filteredGoals = filter === 'All' 
      ? goalsBySize 
      : goalsBySize.filter(goal => goal.category === filter);
    
    // Sort by amount left to achieve (target - current)
    return filteredGoals.sort((a, b) => {
      const aRemaining = a.targetAmount - a.currentAmount;
      const bRemaining = b.targetAmount - b.currentAmount;
      return sortOrder === 'desc' ? bRemaining - aRemaining : aRemaining - bRemaining;
    });
  };
  
  const filteredGoals = getFilteredGoals();
  const currentCategories = goalSizeTab === 'micro' ? microCategories : macroCategories;
  
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
        
        <GlassCard className="mb-8 p-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-0">
              <Filter className="h-5 w-5 mr-2 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {currentCategories.map((category) => (
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
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="flex items-center gap-1"
            >
              {sortOrder === 'desc' ? (
                <>
                  <ArrowDownAZ className="h-4 w-4" />
                  <span>Highest Amount Due First</span>
                </>
              ) : (
                <>
                  <ArrowUpZA className="h-4 w-4" />
                  <span>Lowest Amount Due First</span>
                </>
              )}
            </Button>
          </div>
        </GlassCard>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredGoals.length === 0 ? (
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
