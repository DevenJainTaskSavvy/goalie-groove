import React from "react";
import { Goal } from "@/types/finance";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/services/api";

interface EditGoalFormFieldsProps {
  formData: {
    id: string;
    title: string;
    targetAmount: string;
    currentAmount: string;
    timeline: number;
    category: Goal["category"];
    riskLevel: Goal["riskLevel"];
  };
  monthlyContribution: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const EditGoalFormFields: React.FC<EditGoalFormFieldsProps> = ({
  formData,
  monthlyContribution,
  handleChange,
  handleSelectChange,
}) => {
  return (
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
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleSelectChange("category", value)}
        >
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
        <Select
          value={formData.riskLevel}
          onValueChange={(value) => handleSelectChange("riskLevel", value)}
        >
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
  );
};

export default EditGoalFormFields;
