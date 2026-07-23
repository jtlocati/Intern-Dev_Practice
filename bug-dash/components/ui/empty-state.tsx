import { cn } from "@/lib/utils";

export interface EmptyStateProps {
   /** an icon node, e.g. a lucide-react icon */
   icon?: React.ReactNode;
   title: string;
   description?: string;
   /** primary action, e.g. a <Button> or <Link> */
   action?: React.ReactNode;
   className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
   return (
      <div className={cn("flex flex-col items-center justify-center rounded-[var(--radius)]", "border border-dashed border-[var(--border-strong)] bg-[var(--surface)]", "px-6 py-12 text-center", className)}>
         {icon && (
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--fg-subtle)]" aria-hidden="true">
               {icon}
            </div>
         )}
         <p className="text-sm font-semibold text-[var(--fg)]">{title}</p>
         {description && <p className="mt-1 max-w-sm text-sm text-[var(--fg-muted)]">{description}</p>}
         {action && <div className="mt-5">{action}</div>}
      </div>
   );
}
