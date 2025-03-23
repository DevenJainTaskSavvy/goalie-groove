import React, { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import {
  Target,
  TrendingUp,
  CalendarClock,
  MoreVertical,
  Pencil,
  Trash2,
  IndianRupee,
  ArrowLeftRight,
  Wallet,
  Calendar,
  Book,
  CreditCard,
  Car,
  Plane,
  Smartphone,
  ShoppingBag,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteGoal } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmation from "@/components/dashboard/DeleteConfirmation";
import { GoalCategory } from "@/types/finance";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GoalCardProps {
  id: string;
  title: string;
  targetAmount: string;
  currentAmount: string;
  timeline: string;
  progress: number;
  category: GoalCategory;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onFinance?: (
    goalId: string,
    goalTitle: string,
    remainingAmount: number
  ) => void;
  onRebalance?: (
    goalId: string,
    goalTitle: string,
    currentAmountValue: number
  ) => void;
  onUseEmergencyFund?: (
    goalId: string,
    goalTitle: string,
    amount: number
  ) => void;
  isMicroGoal?: boolean;
  isMacroGoal?: boolean;
}

const GoalCard = ({
  id,
  title,
  targetAmount,
  currentAmount,
  timeline,
  progress,
  category,
  onDelete,
  onEdit,
  onFinance,
  onRebalance,
  onUseEmergencyFund,
  isMicroGoal = false,
  isMacroGoal = false,
}: GoalCardProps) => {
  const [showFinanceDialog, setShowFinanceDialog] = useState(false);
  const [emergencyFundAmount, setEmergencyFundAmount] = useState("");
  const [showEmergencyFundDialog, setShowEmergencyFundDialog] = useState(false);

  const categoryIcons = {
    Retirement: <Calendar className="h-5 w-5 text-purple-400" />,
    Education: <Book className="h-5 w-5 text-blue-400" />,
    Housing: <CreditCard className="h-5 w-5 text-emerald-400" />,
    Vehicle: <Car className="h-5 w-5 text-amber-400" />,
    Travel: <Plane className="h-5 w-5 text-rose-400" />,
    Electronics: <Smartphone className="h-5 w-5 text-indigo-400" />,
    Accessories: <ShoppingBag className="h-5 w-5 text-pink-400" />,
    Other: <Target className="h-5 w-5 text-gray-400" />,
  };

  // Calculate remaining amount (removing currency symbols and parsing)
  const getNumericValue = (value: string) => {
    return parseFloat(value.replace(/[^0-9.-]+/g, ""));
  };

  const targetValue = getNumericValue(targetAmount);
  const currentValue = getNumericValue(currentAmount);
  const remainingAmount = targetValue - currentValue;

  const handleFinance = () => {
    if (onFinance) {
      onFinance(id, title, remainingAmount);
      setShowFinanceDialog(false);
    }
  };

  const handleRebalance = () => {
    if (onRebalance) {
      onRebalance(id, title, currentValue);
    }
  };

  const handleUseEmergencyFund = () => {
    if (onUseEmergencyFund && emergencyFundAmount) {
      const amount = parseFloat(emergencyFundAmount);
      if (!isNaN(amount) && amount > 0) {
        onUseEmergencyFund(id, title, amount);
        setEmergencyFundAmount("");
        setShowEmergencyFundDialog(false);
      }
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <GlassCard className="hover:translate-y-[-4px] transition-transform duration-300">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary mr-3">
                  {categoryIcons[category]}
                </span>
                <h3 className="font-medium text-lg">{title}</h3>
              </div>
              <span className="text-xs py-1 px-2 rounded-full bg-secondary/50 text-muted-foreground">
                {category}
              </span>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Target</span>
                <span className="font-medium">{targetAmount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Current</span>
                <span className="font-medium">{currentAmount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Timeline</span>
                <span className="font-medium">{timeline}</span>
              </div>

              {progress < 100 && (
                <div className="flex flex-col space-y-2 mt-2">
                  {/* Finance button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        size="sm"
                      >
                        <IndianRupee className="h-4 w-4" />
                        Finance
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Finance Your Goal</AlertDialogTitle>
                        <AlertDialogDescription>
                          Would you like to finance the remaining ₹
                          {remainingAmount.toFixed(2)} for "{title}"? This will
                          create a loan and instantly fulfill your goal.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleFinance}>
                          Yes, Apply for Financing
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* Re-Balance button - only for micro goals */}
                  {isMicroGoal && currentValue > 0 && (
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          size="sm"
                        >
                          <ArrowLeftRight className="h-4 w-4" />
                          Re-Balance
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Re-Balance Your Goal</SheetTitle>
                          <SheetDescription>
                            Redistribute the funds from "{title}" to one of your
                            other micro goals. Available amount: ₹
                            {currentValue.toFixed(2)}
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                          <Button
                            onClick={handleRebalance}
                            className="w-full mt-4"
                          >
                            Continue to Re-Balance
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  )}

                  {/* Use Emergency Fund button - only for macro goals */}
                  {isMacroGoal && (
                    <Dialog
                      open={showEmergencyFundDialog}
                      onOpenChange={setShowEmergencyFundDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          size="sm"
                        >
                          <Wallet className="h-4 w-4" />
                          Use Emergency Fund
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Use Emergency Fund</DialogTitle>
                          <DialogDescription>
                            Specify the amount from your emergency fund to
                            contribute towards "{title}".
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="emergencyAmount">
                              Amount to use
                            </Label>
                            <Input
                              id="emergencyAmount"
                              type="number"
                              min="1"
                              max={remainingAmount}
                              value={emergencyFundAmount}
                              onChange={(e) =>
                                setEmergencyFundAmount(e.target.value)
                              }
                              placeholder="Enter amount"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowEmergencyFundDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleUseEmergencyFund}>
                            Confirm
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    progress >= 75
                      ? "bg-emerald-500"
                      : progress >= 50
                      ? "bg-amber-500"
                      : progress >= 25
                      ? "bg-orange-500"
                      : "bg-rose-500"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-40">
        <ContextMenuItem className="gap-2" onClick={() => onEdit(id)}>
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </ContextMenuItem>

        <Dialog>
          <DialogTrigger asChild>
            <ContextMenuItem
              className="gap-2 text-red-500"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </ContextMenuItem>
          </DialogTrigger>
          <DeleteConfirmation title={title} onConfirm={() => onDelete(id)} />
        </Dialog>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GoalCard;
