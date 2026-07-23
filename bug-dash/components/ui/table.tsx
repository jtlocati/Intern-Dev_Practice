import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
   return (
      <div className="w-full overflow-x-auto rounded-[var(--radius)] border border-[var(--border)]">
         <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
      </div>
   );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
   return <thead className={cn("bg-[var(--surface-2)]", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
   return <tbody className={cn("divide-y divide-[var(--border)]", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
   return <tr className={cn("transition-colors hover:bg-[var(--surface-2)]/60", className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
   return <th className={cn("h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]", className)} {...props} />;
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
   return <td className={cn("px-4 py-3 align-middle text-[var(--fg)]", className)} {...props} />;
}
