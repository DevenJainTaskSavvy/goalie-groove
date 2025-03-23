import React from "react";
import { Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type PlanFeature = {
  name: string;
  included: boolean;
};

type PricingPlan = {
  name: string;
  description: string;
  price: string;
  period: string;
  features: PlanFeature[];
  buttonText: string;
  badge?: string;
  highlight?: boolean;
};

interface PricingSectionProps {
  variant?: "landing" | "dashboard";
  currentPlan?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  variant = "landing",
  currentPlan,
}) => {
  const navigate = useNavigate();
  const isDashboard = variant === "dashboard";

  const plans: PricingPlan[] = [
    {
      name: "Free",
      description: "Basic planning tools with ads",
      price: "₹0",
      period: "forever",
      features: [
        { name: "Goal tracking", included: true },
        { name: "Investment dashboard", included: true },
        { name: "Basic financial advice", included: true },
        { name: "Ad-supported experience", included: true },
        { name: "Mutual fund suggestions", included: false },
        { name: "Auto-payment functionality", included: false },
      ],
      buttonText: currentPlan === "free" ? "Current Plan" : "Get Started",
      badge: "Popular",
    },
    {
      name: "Pro",
      description: "Advanced planning with MF suggestions",
      price: "₹599",
      period: "per month",
      features: [
        { name: "Everything in Free", included: true },
        { name: "No advertisements", included: true },
        { name: "Mutual fund suggestions", included: true },
        { name: "Advanced goal planning", included: true },
        { name: "Portfolio analysis", included: true },
        { name: "Auto-payment functionality", included: false },
      ],
      buttonText: currentPlan === "pro" ? "Current Plan" : "Upgrade to Pro",
      highlight: true,
    },
    {
      name: "Premium",
      description: "Full autopay functionality & more",
      price: "₹999",
      period: "per month",
      features: [
        { name: "Everything in Pro", included: true },
        { name: "Auto-payment functionality", included: true },
        { name: "Personal finance coach", included: true },
        { name: "Tax optimization", included: true },
        { name: "Priority support", included: true },
        { name: "Custom investment strategies", included: true },
      ],
      buttonText:
        currentPlan === "premium" ? "Current Plan" : "Upgrade to Premium",
    },
  ];

  return (
    <div className={cn("py-4 md:py-8", isDashboard ? "max-w-6xl mx-auto" : "")}>
      <div className="text-center mb-6">
        <h2
          className={cn(
            "text-3xl md:text-4xl font-bold mb-2",
            isDashboard ? "text-foreground" : "text-gradient"
          )}
        >
          Choose Your Plan
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the plan that best fits your investment goals and financial
          journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {plans.map((plan, index) => (
          <GlassCard
            key={index}
            className={cn(
              "h-full flex flex-col",
              plan.highlight &&
                "border-primary/40 bg-black/40 relative overflow-visible"
            )}
          >
            {plan.badge && (
              <div className="absolute top-1 right-4 bg-primary text-primary-foreground text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap">
                {plan.badge}
              </div>
            )}

            <div className="p-6 md:p-8 flex-1">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-muted-foreground/50 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={
                        feature.included ? "" : "text-muted-foreground/50"
                      }
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 pb-6 md:px-8 md:pb-8 mt-auto">
              <Button
                variant={plan.highlight ? "default" : "outline"}
                className="w-full"
                size="lg"
                disabled={currentPlan === plan.name.toLowerCase()}
                onClick={() => {
                  if (isDashboard) {
                    // Handle subscription logic for existing users
                    if (currentPlan !== plan.name.toLowerCase()) {
                      // Navigate to checkout or update subscription
                    }
                  } else {
                    // For landing page, direct to signup
                    navigate("/signup");
                  }
                }}
              >
                {plan.buttonText}
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
