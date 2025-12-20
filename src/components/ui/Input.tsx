import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  type?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-2.5 rounded-apple border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400';
    const errorStyles = 'border-red-500 focus:ring-red-500';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            baseStyles,
            error ? errorStyles : '',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
