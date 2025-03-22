
import React from 'react';
import { formatCurrency } from '@/services/api';
import GlassCard from '@/components/ui/GlassCard';
import { Wallet, CalendarClock, PiggyBank, ArrowDown } from 'lucide-react';

interface FinancialMetricsProps {
  initialInvestment: number;
  remainingPrincipal: number;
  totalMonthlyCommitment: number;
  actualMonthlyPayment: number;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({
  initialInvestment,
  remainingPrincipal,
  totalMonthlyCommitment,
  actualMonthlyPayment,
}) => {
  const commitmentRatio = totalMonthlyCommitment > 0 
    ? Math.round((actualMonthlyPayment / totalMonthlyCommitment) * 100) 
    : 100;
  
  const metrics = [
    {
      title: 'Initial Investment',
      value: formatCurrency(initialInvestment),
      icon: <PiggyBank className="h-5 w-5 text-blue-400" />,
      description: 'Principal amount started with'
    },
    {
      title: 'Remaining Principal',
      value: formatCurrency(remainingPrincipal),
      icon: <Wallet className="h-5 w-5 text-emerald-400" />,
      description: 'Available for new investments'
    },
    {
      title: 'Monthly Commitment',
      value: formatCurrency(totalMonthlyCommitment),
      icon: <CalendarClock className="h-5 w-5 text-purple-400" />,
      description: 'Total monthly goal contributions'
    },
    {
      title: 'Actual Monthly Payment',
      value: formatCurrency(actualMonthlyPayment),
      icon: <ArrowDown className="h-5 w-5 text-amber-400" />,
      description: `${commitmentRatio}% of total commitment`
    }
  ];

  return (
    <GlassCard>
      <h3 className="text-lg font-medium mb-4">Financial Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 rounded-lg bg-white/5">
            <div className="flex items-center mb-2">
              <div className="flex-shrink-0 p-2 rounded-full bg-white/10 mr-3">
                {metric.icon}
              </div>
              <p className="text-sm font-medium">{metric.title}</p>
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default FinancialMetrics;
