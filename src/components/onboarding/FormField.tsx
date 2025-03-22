
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/types/finance';

interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  options?: string[];
  required: boolean;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type,
  placeholder,
  options,
  required,
  value,
  onChange
}) => {
  return (
    <div className="space-y-2 animate-fade-in">
      <Label htmlFor={name}>{label}</Label>
      
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground"
          required={required}
        >
          <option value="">{placeholder}</option>
          {options?.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          required={required}
          className="bg-background/50"
        />
      )}
    </div>
  );
};

export default FormField;
