
import React, { useState, useEffect } from 'react';
import { Goal } from '@/types/finance';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { formatCurrency, parseCurrency, calculateMonthlyContribution } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface EditGoalDialogProps {
  goal: Goal;
  onSave: (goal: Partial<Goal>) => void;
  onCancel: () => void;
}

const EditGoalDialog: React.FC<EditGoalDialogProps> = ({ goal, onSave, onCancel }) => {
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = () => {
    try {
      // Parse currency strings back to numbers
      const parsedTargetAmount = parseCurrency(formData.targetAmount);
      const parsedCurrentAmount = parseCurrency(formData.currentAmount);
      
      // Validate target amount and current amount
      if (isNaN(parsedTargetAmount) || isNaN(parsedCurrentAmount)) {
        toast({
          title: "Error",
          description: "Target amount and current amount must be valid numbers.",
          variant: "destructive"
        });
        return;
      }
      
      if (parsedTargetAmount <= 0) {
        toast({
          title: "Error",
          description: "Target amount must be greater than zero.",
          variant: "destructive"
        });
        return;
      }
      
      if (parsedCurrentAmount < 0) {
        toast({
          title: "Error",
          description: "Current amount cannot be negative.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate timeline
      if (formData.timeline <= 0) {
        toast({
          title: "Error",
          description: "Timeline must be greater than zero.",
          variant: "destructive"
        });
        return;
      }
      
      // Calculate monthly contribution
      const calculatedContribution = calculateMonthlyContribution(
        parsedTargetAmount,
        parsedCurrentAmount,
        formData.timeline,
        formData.riskLevel
      );
      
      // Construct the updated goal object
      const updatedGoal: Partial<Goal> = {
        id: formData.id,
        title: formData.title,
        targetAmount: parsedTargetAmount,
        currentAmount: parsedCurrentAmount,
        timeline: formData.timeline,
        category: formData.category,
        riskLevel: formData.riskLevel,
        monthlyContribution: calculatedContribution,
        progress: Math.min(100, Math.round((parsedCurrentAmount / parsedTargetAmount) * 100)),
      };
      
      onSave(updatedGoal);
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal. Please check your inputs and try again.",
        variant: "destructive"
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
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="targetAmount" className="text-right">
            Target Amount
          </Label>
          <Input
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="currentAmount" className="text-right">
            Current Amount
          </Label>
          <Input
            id="currentAmount"
            name="currentAmount"
            value={formData.currentAmount}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="timeline" className="text-right">
            Timeline (Years)
          </Label>
          <Input
            type="number"
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setFormData(prevData => ({
                ...prevData,
                timeline: isNaN(value) ? 1 : Math.max(1, value), // Ensure timeline is not less than 1
              }));
            }}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prevData => ({ ...prevData, category: value as Goal['category'] }))} >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Retirement">Retirement</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Housing">Housing</SelectItem>
              <SelectItem value="Vehicle">Vehicle</SelectItem>
              <SelectItem value="Travel">Travel</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="riskLevel" className="text-right">
            Risk Level
          </Label>
          <Select value={formData.riskLevel} onValueChange={(value) => setFormData(prevData => ({ ...prevData, riskLevel: value as Goal['riskLevel'] }))}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="aggressive">Aggressive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="monthlyContribution" className="text-right">
            Monthly Contribution
          </Label>
          <Input
            type="text"
            id="monthlyContribution"
            name="monthlyContribution"
            value={formatCurrency(monthlyContribution)}
            className="col-span-3"
            readOnly
          />
        </div>
      </div>
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
