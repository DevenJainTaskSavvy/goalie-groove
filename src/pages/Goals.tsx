
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import GoalCard from '@/components/dashboard/GoalCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, Loader2 } from 'lucide-react';
import { GoalCategory } from '@/types/finance';
import { getGoals, formatCurrency } from '@/services/api';

const Goals = () => {
  const [filter, setFilter] = useState<GoalCategory | 'All'>('All');
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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
                title={goal.title}
                targetAmount={formatCurrency(goal.targetAmount)}
                currentAmount={formatCurrency(goal.currentAmount)}
                timeline={`${goal.timeline} years`}
                progress={goal.progress}
                category={goal.category}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Goals;
