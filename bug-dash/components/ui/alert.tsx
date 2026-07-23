// cn = helper that merges Tailwind class strings together cleanly.
import { cn } from "@/lib/utils";

// The four severities an alert can communicate.
type Variant = "error" | "warning" | "info" | "success";

// Lookup table: each variant -> its Tailwind classes.
// Same pattern as Badge's tones: a faint background (/10), solid text in
// the same color, and a slightly stronger border (/20) so the message
// reads clearly without shouting.
const variants: Record<Variant, string> = {
   error: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20",
   warning: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/25",
   info: "bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/20",
   success: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
   variant?: Variant; // which severity to display — defaults to "info"
}

export function Alert({ className, variant = "info", children, ...props }: AlertProps) {
   return (
      <div
         // role="alert" tells assistive tech to announce this content immediately.
         role="alert"
         className={cn(
            // Base styles that apply regardless of variant: bordered box with padding.
            "flex items-start gap-2.5 rounded-[var(--radius)] border px-4 py-3",
            "text-sm leading-relaxed",
            // Add the variant's background/text/border classes from the lookup table.
            variants[variant],
            // Any extra classes passed in from outside come last, so they can override.
            className,
         )}
         {...props}
      >
         {children}
      </div>
   );
}
