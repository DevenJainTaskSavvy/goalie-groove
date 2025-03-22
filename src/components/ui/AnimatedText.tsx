
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  variant?: 'gradient' | 'primary' | 'default';
  delay?: number;
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

const AnimatedText = ({
  text,
  className,
  variant = 'default',
  delay = 0,
  element: Element = 'h2',
}: AnimatedTextProps) => {
  return (
    <Element
      className={cn(
        'animate-slide-up opacity-0',
        {
          'text-gradient': variant === 'gradient',
          'text-gradient-primary': variant === 'primary',
          'text-foreground': variant === 'default',
        },
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {text}
    </Element>
  );
};

export default AnimatedText;
