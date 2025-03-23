
import React from 'react';
import { Bookmark, Star, Trophy, Target, Gift, Lightbulb, Wallet, PiggyBank } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isUnlocked: boolean;
  xpReward: number;
  category: 'savings' | 'investment' | 'education' | 'budgeting';
}

const achievements: Achievement[] = [
  {
    id: 'budget-master',
    title: 'Budget Master',
    description: 'Create your first monthly budget. Adulting 101!',
    icon: Wallet,
    isUnlocked: true,
    xpReward: 100,
    category: 'budgeting'
  },
  {
    id: 'savings-starter',
    title: 'Savings Starter',
    description: 'Save your first $100. Small flex, but okay!',
    icon: PiggyBank,
    isUnlocked: true,
    xpReward: 150,
    category: 'savings'
  },
  {
    id: 'investment-rookie',
    title: 'Investment Rookie',
    description: 'Make your first investment. Stonks!',
    icon: Target,
    isUnlocked: true,
    xpReward: 200,
    category: 'investment'
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Complete 5 financial lessons. Big brain energy!',
    icon: Lightbulb,
    isUnlocked: false,
    xpReward: 250,
    category: 'education'
  },
  {
    id: 'goal-crusher',
    title: 'Goal Crusher',
    description: 'Complete your first financial goal. We love to see it!',
    icon: Trophy,
    isUnlocked: false,
    xpReward: 300,
    category: 'savings'
  },
  {
    id: 'investment-pro',
    title: 'Investment Pro',
    description: 'Diversify your portfolio. Rizz level: financial!',
    icon: Bookmark,
    isUnlocked: false,
    xpReward: 350,
    category: 'investment'
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Maintain a 7-day login streak. Consistency is key, bestie!',
    icon: Star,
    isUnlocked: false,
    xpReward: 200,
    category: 'education'
  },
  {
    id: 'reward-collector',
    title: 'Reward Collector',
    description: 'Unlock 5 rewards. Secure the bag!',
    icon: Gift,
    isUnlocked: false,
    xpReward: 250,
    category: 'budgeting'
  }
];

const AchievementGrid: React.FC = () => {
  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'savings':
        return 'text-blue-400';
      case 'investment':
        return 'text-green-400';
      case 'education':
        return 'text-purple-400';
      case 'budgeting':
        return 'text-yellow-400';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {achievements.map((achievement) => (
        <HoverCard key={achievement.id}>
          <HoverCardTrigger asChild>
            <div 
              className={cn(
                "relative group p-4 flex flex-col items-center justify-center text-center gap-3 rounded-xl transition-all duration-300 h-32",
                achievement.isUnlocked
                  ? "glass-morphism cursor-pointer hover:translate-y-[-2px]"
                  : "bg-secondary/20 border border-secondary/20 opacity-60 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                achievement.isUnlocked 
                  ? "bg-secondary/40 group-hover:bg-primary/20" 
                  : "bg-secondary/30"
              )}>
                {React.createElement(achievement.icon, { 
                  className: cn(
                    "h-6 w-6 transition-all duration-300",
                    achievement.isUnlocked
                      ? getCategoryColor(achievement.category)
                      : "text-muted-foreground"
                  )
                })}
              </div>
              
              <h4 className={cn(
                "font-medium text-sm",
                achievement.isUnlocked ? "text-foreground" : "text-muted-foreground"
              )}>
                {achievement.title}
              </h4>
              
              {achievement.isUnlocked && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 bg-primary/20 border border-primary/40"
                >
                  {achievement.xpReward} XP
                </Badge>
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent side="top" align="center" className="w-72">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{achievement.title}</h4>
                <Badge className={getCategoryColor(achievement.category)}>
                  {achievement.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
              
              <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Reward: {achievement.xpReward} XP</span>
              </div>
              
              {!achievement.isUnlocked && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Complete the required actions to unlock this achievement
                  </p>
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};

export default AchievementGrid;
