
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface Investment {
  name: string;
  value: number;
  color: string;
  displayValue: string;
}

interface InvestmentBreakdownProps {
  data: Investment[];
  total: string;
  growth: string;
  isPositive: boolean;
}

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

const InvestmentBreakdown = ({ data, total, growth, isPositive }: InvestmentBreakdownProps) => {
  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col">
          <h3 className="text-xl font-medium mb-1">Your Holdings</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{total}</span>
            <span className={cn(
              "ml-2 text-sm",
              isPositive ? "text-emerald-500" : "text-rose-500"
            )}>
              {isPositive ? "+" : ""}{growth}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="md:col-span-2 p-6">
          <div className="flex flex-col space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-4 rounded-xl bg-white/5">
                <div className="flex items-center">
                  <span 
                    className="h-3 w-3 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="font-medium">{item.displayValue}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-3 h-[250px] flex items-center justify-center p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
};

export default InvestmentBreakdown;
