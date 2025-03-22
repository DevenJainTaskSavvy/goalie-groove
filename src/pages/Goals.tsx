
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import GoalCard from '@/components/dashboard/GoalCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter } from 'lucide-react';

type GoalCategory = 'Retirement' | 'Education' | 'Housing' | 'Vehicle' | 'Travel' | 'Other';

interface Goal {
  title: string;
  targetAmount: string;
  currentAmount: string;
  timeline: string;
  progress: number;
  category: GoalCategory;
}

const Goals = () => {
  const [filter, setFilter] = useState<GoalCategory | 'All'>('All');
  
  // Sample goals data
  const goals: Goal[] = [
    {
      title: 'Retirement',
      targetAmount: '₹2.5Cr',
      currentAmount: '₹35L',
      timeline: '25 years',
      progress: 14,
      category: 'Retirement',
    },
    {
      title: 'Dream Home',
      targetAmount: '₹80L',
      currentAmount: '₹12L',
      timeline: '5 years',
      progress: 15,
      category: 'Housing',
    },
    {
      title: 'Child\'s Education',
      targetAmount: '₹50L',
      currentAmount: '₹8L',
      timeline: '10 years',
      progress: 16,
      category: 'Education',
    },
    {
      title: 'Family Car',
      targetAmount: '₹12L',
      currentAmount: '₹3L',
      timeline: '2 years',
      progress: 25,
      category: 'Vehicle',
    },
    {
      title: 'Europe Trip',
      targetAmount: '₹8L',
      currentAmount: '₹2L',
      timeline: '1 year',
      progress: 25,
      category: 'Travel',
    },
    {
      title: 'Emergency Fund',
      targetAmount: '₹10L',
      currentAmount: '₹6L',
      timeline: '1 year',
      progress: 60,
      category: 'Other',
    }
  ];
  
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
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Goal
            </Button>
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
        
        {filteredGoals.length === 0 ? (
          <GlassCard className="text-center py-12">
            <p className="text-muted-foreground">No goals found in this category.</p>
            <Button className="mt-4 gap-2">
              <PlusCircle className="h-4 w-4" />
              Create your first goal
            </Button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal, index) => (
              <GoalCard 
                key={index}
                title={goal.title}
                targetAmount={goal.targetAmount}
                currentAmount={goal.currentAmount}
                timeline={goal.timeline}
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
