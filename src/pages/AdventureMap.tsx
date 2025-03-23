
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import AdventureMapPath from "@/components/adventure/AdventureMapPath";
import AchievementGrid from "@/components/adventure/AchievementGrid";
import UserLevelProgress from "@/components/adventure/UserLevelProgress";
import DailyStreakCounter from "@/components/adventure/DailyStreakCounter";
import ChallengeSection from "@/components/adventure/ChallengeSection";
import AdventureChatbot from "@/components/adventure/AdventureChatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdventureMap = () => {
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    toast({
      title: "Adventure Awaits! 🚀",
      description: "Ready to level up your financial journey, bestie?",
    });
  }, [toast]);

  const handleMilestoneComplete = () => {
    setShowConfetti(true);
    toast({
      title: "Sheesh! Milestone completed! 🏆",
      description: "You just unlocked new rewards! No cap!",
      variant: "default",
    });
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container pt-24 px-4 mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* User stats section */}
          <div className="w-full md:w-1/3">
            <div className="glass-morphism p-6 rounded-2xl mb-6">
              <UserLevelProgress currentXP={600} nextLevelXP={1000} level={12} />
            </div>
            
            <div className="glass-morphism p-6 rounded-2xl mb-6">
              <DailyStreakCounter streak={7} />
            </div>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="map">Adventure Map</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
              </TabsList>
              
              <TabsContent value="map" className="animate-fade-in">
                <div className="glass-morphism p-6 rounded-2xl mb-6">
                  <h2 className="text-2xl font-bold text-gradient mb-4">Your Financial Adventure</h2>
                  <p className="text-muted-foreground mb-6">Follow the path to financial freedom, bestie! 💸</p>
                  <AdventureMapPath onMilestoneComplete={handleMilestoneComplete} />
                </div>
              </TabsContent>
              
              <TabsContent value="achievements" className="animate-fade-in">
                <div className="glass-morphism p-6 rounded-2xl mb-6">
                  <h2 className="text-2xl font-bold text-gradient mb-4">Your Achievements</h2>
                  <p className="text-muted-foreground mb-6">Flex your financial wins! 💪</p>
                  <AchievementGrid />
                </div>
              </TabsContent>
              
              <TabsContent value="challenges" className="animate-fade-in">
                <div className="glass-morphism p-6 rounded-2xl mb-6">
                  <h2 className="text-2xl font-bold text-gradient mb-4">Financial Challenges</h2>
                  <p className="text-muted-foreground mb-6">Level up your wallet game! 🔥</p>
                  <ChallengeSection />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Fixed chatbot in bottom-right */}
      <AdventureChatbot />
      
      {/* Confetti effect */}
      {showConfetti && (
        <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50">
          {/* Confetti will be rendered here */}
        </div>
      )}
    </div>
  );
};

export default AdventureMap;
