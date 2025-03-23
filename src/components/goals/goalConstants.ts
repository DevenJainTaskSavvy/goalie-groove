import {
  Plane,
  Smartphone,
  ShoppingBag,
  Target,
  Calendar,
  CreditCard,
  Book,
  Car,
} from "lucide-react";
import { GoalCategory } from "@/types/finance";

export const MICRO_GOAL_TYPES = [
  {
    id: "travel",
    label: "Travel",
    icon: Plane,
    category: "Travel" as GoalCategory,
  },
  {
    id: "electronics",
    label: "Electronics",
    icon: Smartphone,
    category: "Electronics" as GoalCategory,
  },
  {
    id: "accessories",
    label: "Accessories",
    icon: ShoppingBag,
    category: "Accessories" as GoalCategory,
  },
  {
    id: "other",
    label: "Other",
    icon: Target,
    category: "Other" as GoalCategory,
  },
];

export const MACRO_GOAL_TYPES = [
  {
    id: "retirement",
    label: "Retirement",
    icon: Calendar,
    category: "Retirement" as GoalCategory,
  },
  {
    id: "education",
    label: "Education",
    icon: Book,
    category: "Education" as GoalCategory,
  },
  {
    id: "housing",
    label: "Housing",
    icon: CreditCard,
    category: "Housing" as GoalCategory,
  },
  {
    id: "vehicle",
    label: "Vehicle",
    icon: Car,
    category: "Vehicle" as GoalCategory,
  },
  {
    id: "other",
    label: "Other",
    icon: Target,
    category: "Other" as GoalCategory,
  },
];

export const RISK_LEVELS = [
  {
    id: "conservative",
    label: "Conservative",
    description: "Lower risk, lower returns (6% annually)",
  },
  {
    id: "moderate",
    label: "Moderate",
    description: "Balanced risk and returns (10% annually)",
  },
  {
    id: "aggressive",
    label: "Aggressive",
    description: "Higher risk, higher returns (14% annually)",
  },
];
