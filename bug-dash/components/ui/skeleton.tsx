// cn = helper that merges Tailwind class strings together cleanly.
import { cn } from "@/lib/utils";

// A pulsing placeholder block, shown in place of content that's still
// loading. Callers control the size/shape entirely through `className`
// (e.g. "h-4 w-32" for a text line, "h-10 w-10 rounded-full" for an avatar).
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
   return (
      <div
         className={cn(
            // animate-pulse gives the fade in/out loading effect.
            "animate-pulse rounded-[var(--radius)] bg-[var(--surface-2)]",
            className,
         )}
         {...props}
      />
   );
}
