import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, invalid, ...props }, ref) => {
   return (
      <input
         ref={ref}
         aria-invalid={invalid || undefined}
         className={cn(
            "h-9 w-full rounded-[var(--radius)] px-3 text-sm",
            "bg-[var(--surface)] text-[var(--fg)]",
            "border border-[var(--border)]",
            "placeholder:text-[var(--fg-subtle)]",
            "transition-colors outline-none",
            "hover:border-[var(--border-strong)]",
            "focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            invalid && "border-[var(--danger)] focus-visible:border-[var(--danger)] focus-visible:ring-[var(--danger)]/20",
            className,
         )}
         {...props}
      />
   );
});

Input.displayName = "Input";
