import React, { useState } from "react";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import ChatInterface from "@/components/onboarding/ChatInterface";
import AnimatedText from "@/components/ui/AnimatedText";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const handleProfileComplete = () => {
    setActiveTab("goals");
  };

  const handleGoalsComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 border-b border-white/5">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gradient">GROWVEST</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <AnimatedText
            text="Welcome to your financial journey"
            element="h1"
            className="text-3xl md:text-4xl font-bold mb-3"
            variant="gradient"
          />
          <AnimatedText
            text="Let's set up your profile and create your financial goals"
            element="p"
            className="text-lg text-muted-foreground"
            delay={300}
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="profile">Your Profile</TabsTrigger>
              <TabsTrigger value="goals">Set Goals</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="max-w-md mx-auto">
              <OnboardingForm />

              <div className="mt-8 text-center">
                <Button variant="outline" onClick={handleProfileComplete}>
                  I've already completed my profile
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <ChatInterface onComplete={handleGoalsComplete} />

              <div className="mt-8 text-center">
                <Button variant="outline" onClick={handleGoalsComplete}>
                  Skip for now
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Onboarding;
