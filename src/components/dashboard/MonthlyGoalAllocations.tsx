
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, Zap, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AllocationData {
  name: string;
  value: number;
  color: string;
  displayValue: string;
  progress?: number;
}

interface MonthlyGoalAllocationsProps {
  goalAllocationData: AllocationData[];
}

// Fun messages based on progress
const getProgressMessage = (progress: number, goalName: string) => {
  if (progress >= 80) {
    return `Almost there! Your ${goalName} goal is about to pop off! 🚀`;
  } else if (progress >= 50) {
    return `Halfway to ${goalName}! Keep stacking that paper! 💸`;
  } else if (progress >= 25) {
    return `Making moves on your ${goalName} goal! The grind is real! 💯`;
  } else {
    return `Just started your ${goalName} journey! Level up that savings game! 🔥`;
  }
};

// Custom tooltip for pie chart with Gen-Z styled messages
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const progress = data.progress || 0;
    
    let savingsMessage = "You're stacking cash like a pro!";
    if (data.value < 5000) {
      savingsMessage = "Uh-oh, time to level up that budget game! 📉";
    } else if (data.value >= 5000 && data.value < 15000) {
      savingsMessage = "Not bad! But let's get that bag bigger! 💰";
    } else {
      savingsMessage = "Major flex with these savings! You're killing it! 💅";
    }
    
    return (
      <div className="bg-background/95 border border-border p-3 rounded-lg text-sm shadow-xl animate-fade-in max-w-xs">
        <p className="font-bold text-primary mb-1">{data.name}</p>
        <p className="font-semibold">{data.displayValue}</p>
        <p className="text-xs mt-2 text-muted-foreground">{savingsMessage}</p>
        <div className="mt-2">
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>
    );
  }
  return null;
};

const MonthlyGoalAllocations: React.FC<MonthlyGoalAllocationsProps> = ({
  goalAllocationData
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Handle mouse enter/leave on pie segments
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  // Generate a smart savings insight based on the data
  const generateSavingsInsight = () => {
    if (goalAllocationData.length === 0) return null;
    
    const totalAllocated = goalAllocationData.reduce((sum, item) => sum + item.value, 0);
    const highestAllocation = [...goalAllocationData].sort((a, b) => b.value - a.value)[0];
    const randomGoal = goalAllocationData[Math.floor(Math.random() * goalAllocationData.length)];
    
    const insights = [
      `You're ${randomGoal.progress || 0}% closer to your ${randomGoal.name}! ${randomGoal.progress && randomGoal.progress > 50 ? "Almost time to flex! 💪" : "Keep grinding! 💯"}`,
      `Most of your cash is going to ${highestAllocation.name}. That's the vibe! 🔥`,
      `You're allocating ${totalAllocated > 15000 ? "serious" : "decent"} money each month. Financial glow-up loading... ⏳`,
      `Your investment game is ${totalAllocated > 20000 ? "on fire" : "building up"}! ${totalAllocated > 20000 ? "Absolute W! 🏆" : "Keep it up! 📈"}`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  };
  
  return (
    <GlassCard className="mb-8">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-medium mb-1">Monthly Goal Allocations</h3>
        {goalAllocationData.length > 0 && (
          <p className="text-sm text-primary flex items-center gap-2">
            <Zap className="h-4 w-4" />
            {generateSavingsInsight()}
          </p>
        )}
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
                  outerRadius={activeIndex !== null ? 105 : 100}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationDuration={300}
                >
                  {goalAllocationData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className={`transition-all duration-300 ${activeIndex === index ? 'filter drop-shadow-lg' : ''}`}
                      style={{
                        filter: activeIndex === index ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))' : 'none',
                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'transform 0.3s ease, filter 0.3s ease'
                      }}
                    />
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
              <TooltipProvider key={index}>
                <TooltipComponent>
                  <TooltipTrigger asChild>
                    <div 
                      className={`flex flex-col space-y-2 p-2 rounded-md transition-colors duration-200 hover:bg-white/5 cursor-pointer ${activeIndex === index ? 'bg-white/5' : ''}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="text-sm font-medium truncate">{item.name}</div>
                        <div className="text-sm ml-auto font-bold">{item.displayValue}</div>
                      </div>
                      
                      <div className="w-full">
                        <Progress 
                          value={item.progress || 0} 
                          className="h-1.5"
                          style={{
                            background: `linear-gradient(to right, ${item.color}33, ${item.color}11)`,
                          }}
                        />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>{item.progress || 0}% complete</span>
                          {item.progress && item.progress > 50 && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-primary" />
                              <span className="text-primary">On track</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{getProgressMessage(item.progress || 0, item.name)}</p>
                  </TooltipContent>
                </TooltipComponent>
              </TooltipProvider>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Trophy className="h-4 w-4" /> 
                  Savings Tips
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Level up your savings game! 🚀</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Zap className="h-3 w-3 text-primary mt-0.5" />
                      Try the 50/30/20 rule - 50% needs, 30% wants, 20% savings
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-3 w-3 text-primary mt-0.5" />
                      Set up automatic transfers on payday - future you will thank you!
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-3 w-3 text-primary mt-0.5" />
                      Challenge yourself to a no-spend week each month
                    </li>
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default MonthlyGoalAllocations;
