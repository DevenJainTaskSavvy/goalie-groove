
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedText from '@/components/ui/AnimatedText';
import GlassCard from '@/components/ui/GlassCard';
import { ArrowRight, BarChart3, CheckCircle, Sparkles, X } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showError, setShowError] = useState(false);
  
  const handleGetStarted = () => {
    if (phoneNumber.match(/^\+91\d{10}$/)) {
      navigate('/onboarding');
    } else {
      setShowError(true);
    }
  };
  
  const features = [
    {
      title: "Goal-Based Planning",
      description: "Customize your financial journey with specific goals and timelines"
    },
    {
      title: "Smart Investment Breakdown",
      description: "Visualize how your investments are allocated across goals"
    },
    {
      title: "Personalized Recommendations",
      description: "Get tailored advice based on your risk profile and timeline"
    }
  ];
  
  const investmentData = [
    { name: 'Mutual funds', value: '₹52.5L' },
    { name: 'Stocks', value: '₹5.5L' },
    { name: 'Banks', value: '₹10.4L' },
  ];
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gradient">DEZERV</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center py-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <AnimatedText 
            text="Monitor all your investments in one place" 
            element="h1"
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            variant="gradient"
          />
          <AnimatedText 
            text="Set financial goals, track your progress, and get personalized recommendations to achieve financial freedom." 
            element="p"
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            delay={300}
          />
        </div>
        
        <div className="w-full max-w-sm mx-auto mb-16">
          <GlassCard className="overflow-visible">
            <div className="flex flex-col space-y-6">
              <div>
                <AnimatedText 
                  text="Your Holdings" 
                  element="p"
                  className="text-muted-foreground text-sm mb-1"
                />
                <div className="flex items-baseline">
                  <AnimatedText 
                    text="₹68.4 L" 
                    element="h2"
                    className="text-3xl font-bold"
                  />
                  <span className="ml-2 text-sm text-emerald-500">+₹20.06L</span>
                </div>
              </div>
              
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: '400ms' }}>
                {investmentData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="relative animate-fade-in" style={{ animationDelay: '600ms' }}>
                  <Input
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setShowError(false);
                    }}
                    className={`bg-background/50 h-12 pl-4 pr-10 ${showError ? 'border-rose-500' : ''}`}
                  />
                  {phoneNumber && (
                    <button 
                      onClick={() => setPhoneNumber('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {showError && (
                  <p className="text-xs text-rose-500">Please enter a valid phone number (+91XXXXXXXXXX)</p>
                )}
                
                <Button 
                  className="w-full h-12 animate-fade-in group"
                  style={{ animationDelay: '800ms' }}
                  onClick={handleGetStarted}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </GlassCard>
          
          <div className="text-center mt-4 animate-fade-in" style={{ animationDelay: '900ms' }}>
            <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
              See how it works
            </Link>
          </div>
        </div>
        
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <GlassCard key={index} className="animate-fade-in" style={{ animationDelay: `${1000 + index * 200}ms` }}>
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <CheckCircle className="h-6 w-6 text-primary mb-3" />
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </main>
      
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 DEZERV. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
