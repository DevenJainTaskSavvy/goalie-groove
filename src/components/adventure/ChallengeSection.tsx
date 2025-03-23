
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Gift, Star, Target, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  reward?: {
    type: string;
    description: string;
  };
  steps: string[];
  isCompleted: boolean;
}

const challenges: Challenge[] = [
  {
    id: 'budget-challenge',
    title: 'No Spend Challenge 💸',
    description: 'Go 3 days without unnecessary spending. Your wallet will thank you!',
    xpReward: 150,
    difficulty: 'easy',
    reward: {
      type: 'coupon',
      description: 'Myntra 5% Off Coupon'
    },
    steps: [
      'Track all your expenses for 3 days',
      'Identify and avoid unnecessary purchases',
      'Report back after 3 days'
    ],
    isCompleted: false
  },
  {
    id: 'save-challenge',
    title: 'Spare Change Savior 🪙',
    description: 'Save all your spare change for a week. Small moves, big results!',
    xpReward: 200,
    difficulty: 'medium',
    steps: [
      'Collect all physical spare change',
      'Round up digital purchases and save the difference',
      'Transfer total to savings at the end of the week'
    ],
    isCompleted: false
  },
  {
    id: 'investment-challenge',
    title: 'Stock Market Simulation 📈',
    description: 'Practice investing with a virtual portfolio. Risk-free stonks!',
    xpReward: 300,
    difficulty: 'hard',
    reward: {
      type: 'ticket',
      description: 'Free Movie Ticket'
    },
    steps: [
      'Create a paper trading account',
      'Research and select 5 stocks',
      'Monitor performance for 2 weeks',
      'Report your strategy and results'
    ],
    isCompleted: false
  }
];

const ChallengeCard: React.FC<{ challenge: Challenge, onToggle: () => void, isExpanded: boolean }> = ({ 
  challenge, 
  onToggle,
  isExpanded
}) => {
  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'medium':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'hard':
        return 'text-red-400 border-red-400/30 bg-red-400/10';
      default:
        return 'text-foreground';
    }
  };

  return (
    <GlassCard className="overflow-visible">
      <div className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              "bg-secondary/40"
            )}>
              <Target className="h-5 w-5 text-primary" />
            </div>
            
            <div>
              <h3 className="font-bold text-lg">{challenge.title}</h3>
              <p className="text-muted-foreground text-sm">{challenge.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Challenge Steps
              </h4>
              <ul className="space-y-2">
                {challenge.steps.map((step, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="inline-block min-w-[20px] text-center bg-secondary/30 px-1 rounded">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">{challenge.xpReward} XP</span>
                {challenge.reward && (
                  <>
                    <span className="text-muted-foreground mx-1">+</span>
                    <div className="flex items-center gap-1">
                      <Gift className="h-4 w-4 text-primary" />
                      <span className="text-sm">{challenge.reward.description}</span>
                    </div>
                  </>
                )}
              </div>
              
              <Button size="sm" className="gap-1">
                Start Challenge <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

const ChallengeSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleChallenge = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <ChallengeCard 
          key={challenge.id}
          challenge={challenge}
          isExpanded={expandedId === challenge.id}
          onToggle={() => toggleChallenge(challenge.id)}
        />
      ))}
    </div>
  );
};

export default ChallengeSection;
