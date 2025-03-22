
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedText from '@/components/ui/AnimatedText';
import GlassCard from '@/components/ui/GlassCard';
import { ArrowRight, BarChart3, PieChart, LineChart, TrendingUp, Rocket, Shield } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <PieChart className="h-10 w-10 text-primary mb-4" />,
      title: "Smart Portfolio Management",
      description: "Track and visualize your investments across different asset classes"
    },
    {
      icon: <LineChart className="h-10 w-10 text-primary mb-4" />,
      title: "Goal-Based Planning",
      description: "Set financial goals with personalized timelines and track your progress"
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-primary mb-4" />,
      title: "Performance Analytics",
      description: "Detailed insights and analytics to optimize your investment strategies"
    }
  ];
  
  const benefits = [
    {
      icon: <Shield />,
      title: "Secure & Private",
      description: "Bank-level encryption to protect your data"
    },
    {
      icon: <Rocket />,
      title: "Boost Returns",
      description: "Smart recommendations to maximize your investment returns"
    }
  ];
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gradient">GROWVEST</h1>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <AnimatedText 
            text="Reach Financial Freedom With Smart Investment Planning" 
            element="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            variant="gradient"
          />
          <AnimatedText 
            text="Set goals, track your investments, and get personalized recommendations to build wealth and secure your future." 
            element="p"
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            delay={300}
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Hero Image/Illustration */}
        <div className="w-full max-w-4xl mx-auto relative mt-8 animate-scale-in">
          <GlassCard className="p-6 md:p-8 overflow-visible">
            <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="animate-fade-in" style={{ animationDelay: '800ms' }}>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <BarChart3 className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">₹23.4L</h3>
                    <p className="text-sm text-muted-foreground">Total Invested</p>
                  </div>
                </div>
                
                <div className="animate-fade-in" style={{ animationDelay: '900ms' }}>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                      <TrendingUp className="h-7 w-7 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">18.5%</h3>
                    <p className="text-sm text-muted-foreground">Annual Returns</p>
                  </div>
                </div>
                
                <div className="animate-fade-in" style={{ animationDelay: '1000ms' }}>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                      <PieChart className="h-7 w-7 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">5</h3>
                    <p className="text-sm text-muted-foreground">Active Goals</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedText 
              text="Smart Tools for Your Financial Journey" 
              element="h2"
              className="text-3xl md:text-4xl font-bold mb-4"
              variant="gradient"
              delay={300}
            />
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
              Everything you need to build wealth and achieve your financial goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <GlassCard key={index} className="h-full animate-fade-in" style={{ animationDelay: `${500 + index * 200}ms` }}>
                <div className="p-6 md:p-8 flex flex-col h-full">
                  <div className="mb-4">
                    {feature.icon}
                    <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-5 animate-fade-in" style={{ animationDelay: `${900 + index * 200}ms` }}>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <GlassCard className="overflow-visible">
            <div className="p-8 md:p-12 text-center">
              <AnimatedText 
                text="Start Your Financial Journey Today" 
                element="h2"
                className="text-3xl md:text-4xl font-bold mb-6"
                variant="gradient"
              />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                Join thousands of users who are already growing their wealth with GrowVest
              </p>
              <Link to="/signup" className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                <Button size="lg" className="group">
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
      
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 GROWVEST. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
