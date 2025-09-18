import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white border border-gray-200 shadow-lg',
    outline: 'bg-white border-2 border-gray-200',
  };

  return (
    <div
      className={cn('rounded-xl overflow-hidden', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('p-6 pb-4', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);