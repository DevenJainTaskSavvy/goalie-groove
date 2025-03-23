import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import {
  getUserProfile,
  getGoals,
  formatCurrency,
  deleteGoal,
} from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Goal } from "@/types/finance";
import { RefreshCw } from "lucide-react";

// Import our new components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import FinancialOverviewCards from "@/components/dashboard/FinancialOverviewCards";
import MonthlyGoalAllocations from "@/components/dashboard/MonthlyGoalAllocations";
import GoalList from "@/components/dashboard/GoalList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [initialSavings, setInitialSavings] = useState(0);
  const [monthlyCapacity, setMonthlyCapacity] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [totalCurrentAmount, setTotalCurrentAmount] = useState(0);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Monthly allocation by goal
  const [goalAllocationData, setGoalAllocationData] = useState<any[]>([]);

  // Colors for pie chart
  const COLORS = [
    "#6366f1",
    "#f43f5e",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];

  const updateGoalAllocationData = (updatedGoals: Goal[]) => {
    // Calculate total monthly spending on goals
    const totalMonthlySpent = updatedGoals.reduce(
      (sum, goal) => sum + goal.monthlyContribution,
      0
    );
    setMonthlySpent(totalMonthlySpent);

    // Calculate total current amount across all goals
    const totalInvested = updatedGoals.reduce(
      (sum, goal) => sum + goal.currentAmount,
      0
    );
    setTotalCurrentAmount(totalInvested);

    // Prepare data for monthly allocation pie chart
    const allocationData = updatedGoals.map((goal, index) => ({
      name: goal.title,
      value: goal.monthlyContribution,
      color: COLORS[index % COLORS.length],
      displayValue: formatCurrency(goal.monthlyContribution),
      progress: Math.round((goal.currentAmount / goal.targetAmount) * 100),
    }));
    setGoalAllocationData(allocationData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const profile = await getUserProfile();
        if (profile) {
          setUserName(profile.name.split(" ")[0]); // Get first name
          setInitialSavings(profile.savings || 0);
          setMonthlyCapacity(profile.monthlyInvestmentCapacity || 0);
        }

        // Fetch goals
        const goalsData = await getGoals();
        setGoals(goalsData); // Get all goals
        updateGoalAllocationData(goalsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      const updatedGoals = goals.filter((goal) => goal.id !== id);
      setGoals(updatedGoals);
      updateGoalAllocationData(updatedGoals);
      toast({
        title: "Goal deleted",
        description: "The goal has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete goal:", error);
      toast({
        title: "Error",
        description: "Failed to delete the goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditGoal = (id: string) => {
    navigate(`/goals?edit=${id}`);
  };

  const handleEmergencyFundUsed = (amount: number) => {
    setInitialSavings((prev) => prev - amount);
  };

  const handleGoalsUpdate = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    updateGoalAllocationData(updatedGoals);
  };

  const handleSyncSpending = () => {
    setSyncDialogOpen(true);
  };

  const handleSyncConfirm = () => {
    // This is where you would handle the spending sync logic
    toast({
      title: "Spending Habits",
      description: "Spending habits can be improved! You will now be tracked for your spending habits",
    });
    setSyncDialogOpen(false);
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container pt-24 px-4 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <DashboardHeader userName={userName} />
          
          <Button 
            className="mt-4 sm:mt-0 flex items-center gap-2"
            onClick={handleSyncSpending}
          >
            <RefreshCw className="h-4 w-4" />
            Sync Your Spending
          </Button>
        </div>

        {/* Sync Spending Dialog */}
        <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Spending Sync</DialogTitle>
              <DialogDescription>
                Check your habits to know how you can spend better?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setSyncDialogOpen(false)}>
                No
              </Button>
              <Button onClick={handleSyncConfirm}>
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Financial Overview Cards */}
        <FinancialOverviewCards
          initialSavings={initialSavings}
          monthlyCapacity={monthlyCapacity}
          monthlySpent={monthlySpent}
          totalCurrentAmount={totalCurrentAmount}
        />

        {/* Monthly Goal Allocations */}
        <MonthlyGoalAllocations goalAllocationData={goalAllocationData} />

        {/* Goals List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Financial Goals</h2>
          <GoalList
            loading={loading}
            goals={goals}
            goalSizeTab="macro"
            onDelete={handleDeleteGoal}
            onEdit={handleEditGoal}
            onEmergencyFundUsed={handleEmergencyFundUsed}
            onGoalsUpdate={handleGoalsUpdate}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
