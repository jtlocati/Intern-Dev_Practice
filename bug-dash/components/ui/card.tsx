// cn = helper that merges Tailwind class strings together cleanly.
import { cn } from "@/lib/utils";

// The outer container — the bordered, white, rounded box with a soft shadow.
// Everything else (header, content, footer) goes inside this.
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
   return (
      <div
         className={cn(
            "rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-sm",
            // className comes last so a parent can override on a one-off basis.
            className,
         )}
         {...props}
      />
   );
}

// The top section of a card — holds the title and description.
// Stacks its children vertically with a small gap, and adds padding.
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
   return <div className={cn("flex flex-col gap-1 p-5 pb-3", className)} {...props} />;
}

// The card's heading text. Renders an <h3> for proper document structure.
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
   return <h3 className={cn("text-base font-semibold leading-none text-[var(--fg)]", className)} {...props} />;
}

// The muted subtitle line under the title (secondary text color, smaller).
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
   return <p className={cn("text-sm text-[var(--fg-muted)]", className)} {...props} />;
}

// The main body of the card. pt-0 removes top padding so it sits snug
// under the header (which already has bottom padding).
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
   return <div className={cn("p-5 pt-0", className)} {...props} />;
}

// The bottom bar of the card — e.g. for action buttons.
// Has a top border to separate it from the content, and lays its
// children out in a row.
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
   return <div className={cn("flex items-center gap-2 border-t border-[var(--border)] p-5 py-3", className)} {...props} />;
}
