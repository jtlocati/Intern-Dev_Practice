import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

/**
 * A styled native <textarea>. Mirrors the Input primitive's look so
 * multi-line fields (descriptions, comments) match single-line inputs.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full rounded-[var(--radius)] px-3 py-2 text-sm",
          "bg-[var(--surface)] text-[var(--fg)]",
          "border border-[var(--border)]",
          "placeholder:text-[var(--fg-subtle)]",
          "transition-colors outline-none resize-y",
          "hover:border-[var(--border-strong)]",
          "focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid &&
            "border-[var(--danger)] focus-visible:border-[var(--danger)] focus-visible:ring-[var(--danger)]/20",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
