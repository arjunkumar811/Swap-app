import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white/90 placeholder:text-white/50 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
