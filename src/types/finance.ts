export interface UserProfile {
  name: string;
  age: number;
  savings: number;
  monthlyInvestmentCapacity: number;
  relationshipStatus: "single" | "married" | "in a relationship";
  hasKids: "yes" | "no" | "planning for children";
  retirementAge: number;
  purchasePlans: "home" | "car" | "both" | "none";
  riskTolerance?: "conservative" | "moderate" | "aggressive";
}

export type GoalCategory =
  | "Retirement"
  | "Education"
  | "Housing"
  | "Vehicle"
  | "Travel"
  | "Electronics"
  | "Accessories"
  | "Other";

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  timeline: number; // in years
  progress: number;
  category: GoalCategory;
  monthlyContribution: number;
  riskLevel: "conservative" | "moderate" | "aggressive";
  description?: string;
}
