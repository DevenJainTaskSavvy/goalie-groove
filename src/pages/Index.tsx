import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedText from "@/components/ui/AnimatedText";
import GlassCard from "@/components/ui/GlassCard";
import PricingSection from "@/components/pricing/PricingSection";
import Navbar from "@/components/layout/Navbar";
import {
  ArrowRight,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Check,
  Target,
  Users,
  Bell,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <Target className="h-10 w-10 text-primary mb-4" />,
      title: "Precision Goal Tracking",
      description:
        "Monitor progress towards micro and macro financial goals in real time",
    },
    {
      icon: <Users className="h-10 w-10 text-primary mb-4" />,
      title: "Collaborative Investing",
      description:
        "Invest and track goals together with friends, family, or teams",
    },
    {
      icon: <Bell className="h-10 w-10 text-primary mb-4" />,
      title: "Automated Reminders",
      description:
        "Get alerts to stay on track with your investment milestones",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar transparent />

      {/* Hero section */}
      <section className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <AnimatedText
            text="Track. Invest. Achieve. Smart Investing for Every Goal"
            element="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            variant="gradient"
          />
          <AnimatedText
            text="Set micro and macro goals, track your Progress and collaborate with your family and friends."
            element="p"
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            delay={300}
          />

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-fade-in"
            style={{ animationDelay: "600ms" }}
          >
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
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "800ms" }}
                >
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <BarChart3 className="h-9 w-9 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">1M+ </h3>
                    <p className="text-sm text-muted-foreground">
                      Worth of goals tracked
                    </p>
                  </div>
                </div>

                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "900ms" }}
                >
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                      <TrendingUp className="h-9 w-9 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">300k+</h3>
                    <p className="text-sm text-muted-foreground">
                      Users on the platform
                    </p>
                  </div>
                </div>

                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "1000ms" }}
                >
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                      <PieChart className="h-9 w-9 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">80%</h3>
                    <p className="text-sm text-muted-foreground">
                      Success Rate of Goals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 md:py-24 bg-black/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedText
              text="About GROWVEST"
              element="h2"
              className="text-3xl md:text-4xl font-bold mb-4"
              variant="gradient"
              delay={300}
            />
            <p
              className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              Your trusted partner on the journey to financial freedom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <GlassCard
              className="p-6 md:p-8 animate-fade-in"
              style={{ animationDelay: "500ms" }}
            >
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground mb-4">
                At GrowInvest, we believe every financial goal—big or
                small—deserves a clear strategy. Our platform combines micro and
                macro investing, goal-based tracking, and collaborative finance
                to help you stay on course. Whether you're rounding up spare
                change, planning for long-term wealth, or navigating tough
                financial situations, GrowInvest ensures you always know how
                much to invest and when to adjust. 🚀
              </p>
              <p className="text-muted-foreground"></p>
            </GlassCard>

            <GlassCard
              className="p-6 md:p-8 animate-fade-in"
              style={{ animationDelay: "600ms" }}
            >
              <h3 className="text-2xl font-bold mb-4">Why Choose Us</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Intuitive, goal-based investment planning</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Flexible and customizable goals</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Micro & macro investment tracking in one place</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Collaborative investing with friends & family</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automated progress tracking & reminders</span>
                </li>
              </ul>
            </GlassCard>
          </div>
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
            <p
              className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              Everything you need to build wealth and achieve your financial
              goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <GlassCard
                key={index}
                className="h-full animate-fade-in"
                style={{ animationDelay: `${500 + index * 200}ms` }}
              >
                <div className="p-6 md:p-8 flex flex-col h-full">
                  <div className="mb-4">
                    {feature.icon}
                    <h3 className="text-xl font-medium mb-2">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-black/10">
        <div className="container mx-auto px-4">
          <PricingSection variant="landing" />
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
              <p
                className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                Join thousands of users who are already growing their wealth
                with GrowVest
              </p>
              <Link
                to="/signup"
                className="animate-fade-in"
                style={{ animationDelay: "400ms" }}
              >
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
