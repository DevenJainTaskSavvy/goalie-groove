import React, { useState, useEffect } from "react";
import { Goal } from "@/types/finance";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  parseCurrency,
  calculateMonthlyContribution,
  getUserProfile,
} from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import EditGoalFormFields from "./EditGoalFormFields";
import {
  validateGoalForm,
  prepareGoalData,
  validateInitialInvestment,
} from "./goalFormValidation";

interface EditGoalDialogProps {
  goal: Goal;
  onSave: (goal: Partial<Goal>) => void;
  onCancel: () => void;
}

const EditGoalDialog: React.FC<EditGoalDialogProps> = ({
  goal,
  onSave,
  onCancel,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: goal.id,
    title: goal.title,
    targetAmount: formatCurrency(goal.targetAmount),
    currentAmount: formatCurrency(goal.currentAmount),
    timeline: goal.timeline,
    category: goal.category,
    riskLevel: goal.riskLevel,
  });

  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);

  useEffect(() => {
    // Parse currency values to numbers for calculation
    const targetAmount = parseCurrency(formData.targetAmount);
    const currentAmount = parseCurrency(formData.currentAmount);

    const calculatedContribution = calculateMonthlyContribution(
      targetAmount,
      currentAmount,
      formData.timeline,
      formData.riskLevel
    );

    setMonthlyContribution(calculatedContribution);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "timeline") {
      const numValue = parseInt(value, 10);
      setFormData((prevData) => ({
        ...prevData,
        [name]: isNaN(numValue) ? 1 : Math.max(1, numValue), // Ensure timeline is not less than 1
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      const validationResult = validateGoalForm(
        formData.targetAmount,
        formData.currentAmount,
        formData.timeline
      );

      if (!validationResult.isValid) {
        toast({
          title: validationResult.errorTitle,
          description: validationResult.errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Get initial savings and validate new current amount
      const userProfile = await getUserProfile();
      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Get all existing goals
      const goalsString = localStorage.getItem("growvest_goals");
      const existingGoals = goalsString ? JSON.parse(goalsString) : [];

      // Calculate the current amount difference
      const newCurrentAmount = parseCurrency(formData.currentAmount);
      const currentAmountDifference = newCurrentAmount - goal.currentAmount;

      // Only need to validate if we're increasing the current amount
      if (currentAmountDifference > 0) {
        // Calculate total used excluding the current goal's amount
        const totalUsedExcludingCurrent = existingGoals.reduce((sum, g) => {
          return sum + (g.id === goal.id ? 0 : g.currentAmount);
        }, 0);

        // Check if the new amount would exceed initial savings
        if (
          totalUsedExcludingCurrent + newCurrentAmount >
          userProfile.savings
        ) {
          toast({
            title: "Exceeds Available Savings",
            description: `The new amount would exceed your initial savings. You can allocate up to ${formatCurrency(
              userProfile.savings - totalUsedExcludingCurrent
            )}.`,
            variant: "destructive",
          });
          return;
        }
      }

      // Prepare the goal data
      const updatedGoal = prepareGoalData(formData, monthlyContribution);

      // Call the onSave callback with the updated goal
      onSave(updatedGoal);
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        title: "Error",
        description:
          "Failed to update goal. Please check your inputs and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Goal</DialogTitle>
        <DialogDescription>
          Make changes to your financial goal here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <EditGoalFormFields
        formData={formData}
        monthlyContribution={monthlyContribution}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />

      <DialogFooter>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditGoalDialog;
