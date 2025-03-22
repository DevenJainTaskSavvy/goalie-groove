
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'dark';
  noPadding?: boolean;
}

const GlassCard = ({ 
  children, 
  className, 
  variant = 'default', 
  noPadding = false,
  ...props 
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300',
        'animate-scale-in shadow-card',
        {
          'glass-morphism': variant === 'default',
          'neo-blur': variant === 'dark',
          'bg-primary/10 border border-primary/20': variant === 'highlight',
          'p-6': !noPadding,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
