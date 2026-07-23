import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.ComponentProps<"select"> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error = false, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-600 focus:ring-red-600"
            : "border-gray-300 focus:ring-blue-600",
          className
        )}
        aria-invalid={error || undefined}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;
