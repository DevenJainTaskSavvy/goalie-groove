
import React, { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Check, ChevronRight, Gift, Lock, Star, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MilestoneProps {
  id: number;
  title: string;
  description: string;
  xp: number;
  isCompleted: boolean;
  isLocked: boolean;
  reward?: {
    type: 'coupon' | 'ticket' | 'badge' | 'xp';
    description: string;
  };
  onComplete?: () => void;
}

interface AdventureMapPathProps {
  onMilestoneComplete?: () => void;
}

const milestones: MilestoneProps[] = [
  {
    id: 1,
    title: "Budget Basics",
    description: "Learn the fundamentals of budgeting. Easy peasy!",
    xp: 100,
    isCompleted: true,
    isLocked: false,
    reward: {
      type: 'badge',
      description: 'Budget Wizard Badge'
    }
  },
  {
    id: 2,
    title: "Savings 101",
    description: "Start your first savings goal. Future you says thanks!",
    xp: 150,
    isCompleted: true,
    isLocked: false,
    reward: {
      type: 'xp',
      description: '+150 XP Bonus'
    }
  },
  {
    id: 3,
    title: "Investment Intro",
    description: "Dive into the world of investments. Stonks only go up!",
    xp: 200,
    isCompleted: false,
    isLocked: false,
    reward: {
      type: 'coupon',
      description: 'Myntra 10% Off Coupon'
    }
  },
  {
    id: 4,
    title: "Debt Destroyer",
    description: "Strategies to crush your debt. Bye bye, money leaks!",
    xp: 250,
    isCompleted: false,
    isLocked: true,
    reward: {
      type: 'ticket',
      description: 'Free Movie Ticket'
    }
  },
  {
    id: 5,
    title: "Tax Tactics",
    description: "Master tax-saving strategies. Big brain moves only!",
    xp: 300,
    isCompleted: false,
    isLocked: true
  }
];

const Milestone: React.FC<MilestoneProps> = ({ 
  title, 
  description, 
  xp, 
  isCompleted, 
  isLocked, 
  reward,
  onComplete
}) => {
  const handleClick = () => {
    if (!isCompleted && !isLocked && onComplete) {
      onComplete();
    }
  };
  
  const getRewardIcon = () => {
    switch (reward?.type) {
      case 'coupon':
        return <Bookmark className="h-4 w-4" />;
      case 'ticket':
        return <Ticket className="h-4 w-4" />;
      case 'badge':
        return <Bookmark className="h-4 w-4" />;
      case 'xp':
        return <Star className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
            isCompleted 
              ? "bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]" 
              : isLocked 
                ? "bg-secondary/40 cursor-not-allowed" 
                : "bg-secondary hover:bg-secondary/80 cursor-pointer"
          )}
          onClick={handleClick}
          disabled={isLocked}
        >
          {isCompleted ? (
            <Check className="h-6 w-6 text-primary-foreground" />
          ) : isLocked ? (
            <Lock className="h-6 w-6 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-6 w-6 text-foreground" />
          )}
          
          {reward && (
            <div className="absolute -bottom-1 -right-1 bg-accent rounded-full w-6 h-6 flex items-center justify-center">
              {getRewardIcon()}
            </div>
          )}
        </button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-80">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold">{title}</h4>
            <Badge variant="secondary">{xp} XP</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          
          {reward && (
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{reward.description}</span>
            </div>
          )}
          
          {isLocked && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Complete previous milestones to unlock
              </p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const AdventureMapPath: React.FC<AdventureMapPathProps> = ({ onMilestoneComplete }) => {
  const [completedMilestones, setCompletedMilestones] = useState<number[]>(
    milestones.filter(m => m.isCompleted).map(m => m.id)
  );
  
  const handleMilestoneComplete = (id: number) => {
    if (!completedMilestones.includes(id)) {
      setCompletedMilestones([...completedMilestones, id]);
      if (onMilestoneComplete) {
        onMilestoneComplete();
      }
    }
  };
  
  return (
    <div className="relative py-10">
      {/* Curved path */}
      <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-secondary/50 to-secondary/10" 
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      ></div>
      
      {/* Milestones */}
      <div className="space-y-16">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex items-start gap-6">
            <Milestone 
              {...milestone} 
              isCompleted={completedMilestones.includes(milestone.id)}
              onComplete={() => handleMilestoneComplete(milestone.id)}
            />
            
            <div className="flex-1">
              <h3 className={cn(
                "font-bold text-lg mb-1",
                completedMilestones.includes(milestone.id) ? "text-primary" : "text-foreground"
              )}>
                {milestone.title}
              </h3>
              <p className="text-muted-foreground text-sm">{milestone.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdventureMapPath;
