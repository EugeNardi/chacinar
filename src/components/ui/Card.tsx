import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-apple shadow-soft p-6 border border-neutral-200',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
