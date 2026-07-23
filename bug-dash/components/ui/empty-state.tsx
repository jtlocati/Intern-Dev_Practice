// cn = helper that merges Tailwind class strings together cleanly.
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
   title: string; // short heading, e.g. "No issues found"
   description?: string; // optional supporting line with more detail
   action?: React.ReactNode; // optional call-to-action, e.g. a <Button>
}

// A centered placeholder for empty lists/tables/pages — a heading, an
// optional description, and an optional action (like a "Create new" button).
export function EmptyState({ className, title, description, action, ...props }: EmptyStateProps) {
   return (
      <div
         className={cn(
            "flex flex-col items-center justify-center gap-1 px-6 py-12 text-center",
            className,
         )}
         {...props}
      >
         {/* Heading — slightly muted since there's no real content to draw focus to. */}
         <h3 className="text-sm font-medium text-[var(--fg-muted)]">{title}</h3>
         {/* Description — even more muted, it's secondary to the heading. */}
         {description && <p className="text-sm text-[var(--fg-subtle)]">{description}</p>}
         {/* Action sits below with extra spacing so it doesn't feel cramped against the text. */}
         {action && <div className="mt-4">{action}</div>}
      </div>
   );
}
