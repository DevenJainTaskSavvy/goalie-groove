
import { UserProfile } from "@/types/finance";

export interface FormStep {
  title: string;
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    options?: string[];
    required: boolean;
  }[];
}

export const formSteps: FormStep[] = [
  {
    title: "Let's get to know you",
    fields: [
      { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { name: 'age', label: 'Your Age', type: 'number', placeholder: 'Enter your age', required: true }
    ]
  },
  {
    title: "Let's talk about your finances",
    fields: [
      { name: 'savings', label: 'Current Savings (₹)', type: 'number', placeholder: 'Enter current savings amount', required: true },
      { name: 'monthlyInvestmentCapacity', label: 'Monthly Investment Capacity (₹)', type: 'number', placeholder: 'Enter amount you can invest monthly', required: true }
    ]
  },
  {
    title: "Tell us about your life goals",
    fields: [
      { name: 'relationshipStatus', label: 'Relationship Status', type: 'select', placeholder: 'Select your status', options: ['Single', 'Married', 'In a relationship'], required: true },
      { name: 'hasKids', label: 'Do you have children?', type: 'select', placeholder: 'Select an option', options: ['Yes', 'No', 'Planning for children'], required: true }
    ]
  },
  {
    title: "Planning for the future",
    fields: [
      { name: 'retirementAge', label: 'Desired Retirement Age', type: 'number', placeholder: 'At what age do you want to retire?', required: true },
      { name: 'purchasePlans', label: 'Major Purchase Plans', type: 'select', placeholder: 'Select planned purchases', options: ['Home', 'Car', 'Both', 'None'], required: true },
      { name: 'riskTolerance', label: 'Risk Tolerance', type: 'select', placeholder: 'Select your risk tolerance', options: ['Conservative', 'Moderate', 'Aggressive'], required: true }
    ]
  }
];
