import React from "react";
import GlassCard from "@/components/ui/GlassCard";
import { Wallet, DollarSign, PieChart } from "lucide-react";
import { formatCurrency } from "@/services/api";

interface FinancialOverviewCardsProps {
  initialSavings: number;
  monthlyCapacity: number;
  monthlySpent: number;
  totalCurrentAmount?: number;
}

const FinancialOverviewCards: React.FC<FinancialOverviewCardsProps> = ({
  initialSavings,
  monthlyCapacity,
  monthlySpent,
  totalCurrentAmount = 0,
}) => {
  // Calculate remaining monthly capacity
  const remainingCapacity = Math.max(0, monthlyCapacity - monthlySpent);

  // Calculate remaining savings
  const remainingSavings = Math.max(0, initialSavings - totalCurrentAmount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <GlassCard className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-full bg-blue-500/20 mr-4">
            <Wallet className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Initial Savings</p>
            <h3 className="text-2xl font-bold">
              {formatCurrency(initialSavings)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Remaining: {formatCurrency(remainingSavings)}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-full bg-green-500/20 mr-4">
            <DollarSign className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Monthly Investment Capacity
            </p>
            <h3 className="text-2xl font-bold">
              {formatCurrency(monthlyCapacity)}
            </h3>
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
            <p className="text-sm text-muted-foreground">
              Monthly Goal Allocations
            </p>
            <h3 className="text-2xl font-bold">
              {formatCurrency(monthlySpent)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {((monthlySpent / monthlyCapacity) * 100).toFixed(1)}% of capacity
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default FinancialOverviewCards;
