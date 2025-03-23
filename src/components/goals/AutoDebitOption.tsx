
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface AutoDebitOptionProps {
  autoDebit: boolean;
  setAutoDebit: (checked: boolean) => void;
}

const AutoDebitOption: React.FC<AutoDebitOptionProps> = ({ 
  autoDebit, 
  setAutoDebit 
}) => {
  return (
    <div className="mt-6 flex items-center space-x-2">
      <Checkbox 
        id="autoDebit" 
        checked={autoDebit}
        onCheckedChange={(checked) => setAutoDebit(checked === true)}
      />
      <div className="flex flex-col">
        <label
          htmlFor="autoDebit"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Enable Auto-Debit
        </label>
        <p className="text-sm text-muted-foreground">
          Never miss a deadline! Stay on top of your financial goals!
        </p>
      </div>
    </div>
  );
};

export default AutoDebitOption;
