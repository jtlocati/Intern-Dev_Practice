import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-600 focus:ring-red-600"
            : "border-gray-300 focus:ring-blue-600",
          className
        )}
        aria-invalid={error || undefined}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
