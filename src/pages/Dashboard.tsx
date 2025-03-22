
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedText from '@/components/ui/AnimatedText';
import InvestmentBreakdown from '@/components/dashboard/InvestmentBreakdown';
import GoalCard from '@/components/dashboard/GoalCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Award, Calendar, Sparkles, Wallet, Loader2, DollarSign, PieChart } from 'lucide-react';
import { getUserProfile, getGoals, formatCurrency, deleteGoal } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Goal } from '@/types/finance';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [initialSavings, setInitialSavings] = useState(0);
  const [monthlyCapacity, setMonthlyCapacity] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Default investment data (can be enhanced with real data in future)
  const [investmentData, setInvestmentData] = useState([
    { name: 'Mutual funds', value: 52.5, color: '#6366f1', displayValue: '₹52.5L' },
    { name: 'Stocks', value: 5.5, color: '#f43f5e', displayValue: '₹5.5L' },
    { name: 'Banks', value: 10.4, color: '#10b981', displayValue: '₹10.4L' },
  ]);
  
  // Monthly allocation by goal
  const [goalAllocationData, setGoalAllocationData] = useState<any[]>([]);
  
  // Colors for pie chart
  const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const profile = await getUserProfile();
        if (profile) {
          setUserName(profile.name.split(' ')[0]); // Get first name
          setInitialSavings(profile.savings || 0);
          setMonthlyCapacity(profile.monthlyInvestmentCapacity || 0);
        }
        
        // Fetch goals
        const goalsData = await getGoals();
        setGoals(goalsData.slice(0, 3)); // Get top 3 goals for display
        
        // Calculate total monthly spending on goals
        const totalMonthlySpent = goalsData.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
        setMonthlySpent(totalMonthlySpent);
        
        // Prepare data for monthly allocation pie chart
        const allocationData = goalsData.map((goal, index) => ({
          name: goal.title,
          value: goal.monthlyContribution,
          color: COLORS[index % COLORS.length],
          displayValue: formatCurrency(goal.monthlyContribution)
        }));
        setGoalAllocationData(allocationData);
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
  
  // Calculate remaining monthly capacity
  const remainingCapacity = Math.max(0, monthlyCapacity - monthlySpent);
  
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
        
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-full bg-blue-500/20 mr-4">
                <Wallet className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Initial Savings</p>
                <h3 className="text-2xl font-bold">{formatCurrency(initialSavings)}</h3>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-full bg-green-500/20 mr-4">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Investment Capacity</p>
                <h3 className="text-2xl font-bold">{formatCurrency(monthlyCapacity)}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Remaining: {formatCurrency(remainingCapacity)}
                </p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-full bg-purple-500/20 mr-4">
                <PieChart className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Goal Allocations</p>
                <h3 className="text-2xl font-bold">{formatCurrency(monthlySpent)}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {(monthlySpent / monthlyCapacity * 100).toFixed(1)}% of capacity
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <InvestmentBreakdown 
              data={investmentData} 
              total={totalDisplayValue} 
              growth="₹20.06L" 
              isPositive={true} 
            />
          </div>
          
          <GlassCard>
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-medium mb-1">Monthly Goal Allocations</h3>
              <p className="text-sm text-muted-foreground">How your monthly investment is distributed</p>
            </div>
            
            <div className="p-6">
              {goalAllocationData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsChart>
                      <Pie
                        data={goalAllocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {goalAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No goals found to display allocations.</p>
                  <Link to="/goals/new">
                    <Button className="mt-4 gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Create your first goal
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            {goalAllocationData.length > 0 && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
                  {goalAllocationData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="text-sm truncate">{item.name}</div>
                      <div className="text-sm ml-auto font-medium">{item.displayValue}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
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

// Custom tooltip for pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-border p-2 rounded-lg text-xs shadow-xl">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-primary">{payload[0].payload.displayValue}</p>
      </div>
    );
  }
  return null;
};

export default Dashboard;
