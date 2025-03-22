
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { getUserProfile, getGoals, formatCurrency, deleteGoal } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Goal } from '@/types/finance';

// Import our new components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import FinancialOverviewCards from '@/components/dashboard/FinancialOverviewCards';
import MonthlyGoalAllocations from '@/components/dashboard/MonthlyGoalAllocations';
import TopGoalsSection from '@/components/dashboard/TopGoalsSection';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [initialSavings, setInitialSavings] = useState(0);
  const [monthlyCapacity, setMonthlyCapacity] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    return <DashboardLoading />;
  }
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container pt-24 px-4 mx-auto">
        <DashboardHeader userName={userName} />
        
        {/* Financial Overview Cards */}
        <FinancialOverviewCards 
          initialSavings={initialSavings}
          monthlyCapacity={monthlyCapacity}
          monthlySpent={monthlySpent}
        />
        
        {/* Monthly Goal Allocations */}
        <MonthlyGoalAllocations goalAllocationData={goalAllocationData} />
        
        {/* Financial Goals */}
        <TopGoalsSection 
          goals={goals}
          onDeleteGoal={handleDeleteGoal}
          onEditGoal={handleEditGoal}
        />
      </main>
    </div>
  );
};

export default Dashboard;
