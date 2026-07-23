import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
   invalid?: boolean;
}

/**
 * A styled native <select>. Native is deliberate here: it's fully
 * accessible and keyboard/mobile friendly out of the box. For a fancy
 * custom dropdown (e.g. assignee picker with avatars) build a dedicated
 * component in components/issues/ instead.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, invalid, children, ...props }, ref) => {
   return (
      <div className="relative">
         <select
            ref={ref}
            aria-invalid={invalid || undefined}
            className={cn(
               "h-9 w-full appearance-none rounded-[var(--radius)] pl-3 pr-9 text-sm",
               "bg-[var(--surface)] text-[var(--fg)]",
               "border border-[var(--border)]",
               "transition-colors outline-none cursor-pointer",
               "hover:border-[var(--border-strong)]",
               "focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]/20",
               "disabled:cursor-not-allowed disabled:opacity-50",
               invalid && "border-[var(--danger)]",
               className,
            )}
            {...props}
         >
            {children}
         </select>
         <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-subtle)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
         </svg>
      </div>
   );
});

Select.displayName = "Select";
