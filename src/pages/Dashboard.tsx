
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import InvestmentBreakdown from '@/components/dashboard/InvestmentBreakdown';
import GoalCard from '@/components/dashboard/GoalCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Award, Calendar, Sparkles } from 'lucide-react';

const Dashboard = () => {
  // Sample data for investment breakdown
  const investmentData = [
    { name: 'Mutual funds', value: 52.5, color: '#6366f1', displayValue: '₹52.5L' },
    { name: 'Stocks', value: 5.5, color: '#f43f5e', displayValue: '₹5.5L' },
    { name: 'Banks', value: 10.4, color: '#10b981', displayValue: '₹10.4L' },
  ];
  
  // Sample data for goals
  const goals = [
    {
      title: 'Retirement',
      targetAmount: '₹2.5Cr',
      currentAmount: '₹35L',
      timeline: '25 years',
      progress: 14,
      category: 'Retirement' as const,
    },
    {
      title: 'Dream Home',
      targetAmount: '₹80L',
      currentAmount: '₹12L',
      timeline: '5 years',
      progress: 15,
      category: 'Housing' as const,
    },
    {
      title: 'Child\'s Education',
      targetAmount: '₹50L',
      currentAmount: '₹8L',
      timeline: '10 years',
      progress: 16,
      category: 'Education' as const,
    }
  ];
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container pt-24 px-4 mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <AnimatedText 
              text="Welcome back, Rahul" 
              element="h1"
              className="text-3xl font-bold mb-2" 
            />
            <p className="text-muted-foreground">Your financial overview and goal progress</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/goals/new">
              <Button variant="outline" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Goal
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <InvestmentBreakdown 
              data={investmentData} 
              total="₹68.4L" 
              growth="₹20.06L" 
              isPositive={true} 
            />
          </div>
          
          <div>
            <GlassCard className="h-full">
              <h3 className="text-lg font-medium mb-4">Your Progress</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg bg-white/5">
                  <div className="flex-shrink-0 p-2 rounded-full bg-purple-500/20 mr-3">
                    <Award className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Consistent Investor</p>
                    <p className="text-xs text-muted-foreground">5 months streak</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-white/5">
                  <div className="flex-shrink-0 p-2 rounded-full bg-emerald-500/20 mr-3">
                    <Calendar className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Next SIP Date</p>
                    <p className="text-xs text-muted-foreground">15th August, 2023</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-white/5">
                  <div className="flex-shrink-0 p-2 rounded-full bg-amber-500/20 mr-3">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Risk Score</p>
                    <p className="text-xs text-muted-foreground">Moderate (6/10)</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
        
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Financial Goals</h2>
          <Link to="/goals" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
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
      </main>
    </div>
  );
};

export default Dashboard;
