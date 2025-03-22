
import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AllocationData {
  name: string;
  value: number;
  color: string;
  displayValue: string;
}

interface MonthlyGoalAllocationsProps {
  goalAllocationData: AllocationData[];
}

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

const MonthlyGoalAllocations: React.FC<MonthlyGoalAllocationsProps> = ({
  goalAllocationData
}) => {
  return (
    <GlassCard className="mb-8">
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
  );
};

export default MonthlyGoalAllocations;
