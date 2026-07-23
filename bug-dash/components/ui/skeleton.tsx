import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
   return <div className={cn("animate-pulse rounded-[var(--radius)] bg-[var(--surface-2)]", className)} {...props} />;
}

/** Convenience: a few text lines. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
   return (
      <div className={cn("space-y-2", className)}>
         {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${90 - i * 12}%` }} />
         ))}
      </div>
   );
}
