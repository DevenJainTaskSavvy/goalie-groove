
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import InvestmentBreakdown from '@/components/dashboard/InvestmentBreakdown';
import GoalCard from '@/components/dashboard/GoalCard';
import FinancialMetrics from '@/components/dashboard/FinancialMetrics';
import { Button } from '@/components/ui/button';
import { PlusCircle, Award, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { getUserProfile, getGoals, formatCurrency, deleteGoal } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Goal } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [remainingPrincipal, setRemainingPrincipal] = useState(0);
  const [totalMonthlyCommitment, setTotalMonthlyCommitment] = useState(0);
  const [actualMonthlyPayment, setActualMonthlyPayment] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Default investment data (can be enhanced with real data in future)
  const [investmentData, setInvestmentData] = useState([
    { name: 'Mutual funds', value: 52.5, color: '#6366f1', displayValue: '₹52.5L' },
    { name: 'Stocks', value: 5.5, color: '#f43f5e', displayValue: '₹5.5L' },
    { name: 'Banks', value: 10.4, color: '#10b981', displayValue: '₹10.4L' },
  ]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const profile = await getUserProfile();
        if (profile) {
          setUserName(profile.name.split(' ')[0]); // Get first name
          
          // Set initial investment from savings
          const savings = profile.savings || 0;
          setInitialInvestment(savings);
          
          // Calculate the remaining principal (savings minus current investments in goals)
          let totalInvested = 0;
          
          // Fetch goals
          const goalsData = await getGoals();
          setGoals(goalsData.slice(0, 3)); // Get top 3 goals for display
          
          // Calculate total monthly commitment and total invested amount
          let monthlyCommitmentTotal = 0;
          goalsData.forEach(goal => {
            monthlyCommitmentTotal += goal.monthlyContribution;
            totalInvested += goal.currentAmount;
          });
          
          setTotalMonthlyCommitment(monthlyCommitmentTotal);
          setRemainingPrincipal(Math.max(0, savings - totalInvested));
          
          // Set actual monthly payment (for now, assume 80% of commitment as an example)
          // In a real app, this would come from actual payment records
          setActualMonthlyPayment(profile.monthlyInvestmentCapacity || 0);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate total investments (for demo purposes)
  const totalInvestment = investmentData.reduce((sum, item) => sum + item.value, 0);
  const totalDisplayValue = formatCurrency(totalInvestment * 100000); // Convert lakhs to rupees
  
  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
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
  
  const handleEditGoal = (id: string) => {
    navigate(`/goals?edit=${id}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container pt-24 px-4 mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <AnimatedText 
              text={`Welcome back, ${userName || 'Investor'}`}
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
        
        {/* Financial Metrics Section */}
        <div className="mb-8">
          <FinancialMetrics
            initialInvestment={initialInvestment}
            remainingPrincipal={remainingPrincipal}
            totalMonthlyCommitment={totalMonthlyCommitment}
            actualMonthlyPayment={actualMonthlyPayment}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <InvestmentBreakdown 
              data={investmentData} 
              total={totalDisplayValue} 
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
                onDelete={handleDeleteGoal}
                onEdit={handleEditGoal}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
