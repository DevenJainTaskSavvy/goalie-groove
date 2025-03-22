
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import AnimatedText from '@/components/ui/AnimatedText';
import GoalForm from '@/components/goals/GoalForm';
import { MICRO_GOAL_THRESHOLD } from '@/components/dashboard/goalUtils';

const NewGoal = () => {
  const [goalSize, setGoalSize] = useState<'micro' | 'macro'>('micro');
  
  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <AnimatedText 
              text={`Create a New ${goalSize === 'micro' ? 'Micro' : 'Macro'} Goal`}
              element="h1"
              className="text-3xl font-bold mb-2"
              variant="gradient"
            />
            <p className="text-muted-foreground">
              {goalSize === 'micro' 
                ? 'Define smaller financial goals under ₹5,00,000 to track progress towards immediate needs.' 
                : 'Define larger financial goals over ₹5,00,000 to track progress towards major life milestones.'}
            </p>
          </div>
          
          <GoalForm />
        </div>
      </main>
    </div>
  );
};

export default NewGoal;
