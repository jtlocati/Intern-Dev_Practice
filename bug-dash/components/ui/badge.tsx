// cn = helper that merges Tailwind class strings together cleanly.
import { cn } from "@/lib/utils";

// The built-in color "tones" for generic badges (labels, counts, tags, etc.).
type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info" | "violet";

// Lookup table: each tone -> its Tailwind classes.
// The pattern is always: faint background (/10 = 10% opacity), solid text
// in the same color, and a slightly stronger border (/20). This gives that
// soft "pill" look where the color reads clearly but doesn't shout.
const tones: Record<Tone, string> = {
   neutral: "bg-[var(--surface-2)] text-[var(--fg-muted)] border-[var(--border)]",
   primary: "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20",
   success: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
   warning: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/25",
   danger: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20",
   info: "bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/20",
   violet: "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
   tone?: Tone; // pick one of the preset colors above (default: neutral)
   dot?: boolean; // show a small filled dot before the text (great for status)
   color?: string; // OR pass any custom color (e.g. "var(--status-done)") to override the tone
}

export function Badge({ className, tone = "neutral", dot, color, children, style, ...props }: BadgeProps) {
   // If a custom `color` is passed, we build the background/border from it
   // on the fly instead of using a preset tone. color-mix() is a CSS function
   // that blends the color with transparent — so "12%" = a 12%-opacity tint.
   // This is what lets one Badge component handle all 5 statuses and 4
   // priorities without needing a separate class for each.
   const custom = color
      ? {
           color,
           backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
           borderColor: `color-mix(in srgb, ${color} 25%, transparent)`,
           ...style,
        }
      : style;

   return (
      <span
         style={custom}
         className={cn(
            // Base look: pill shape, small text, a gap for the optional dot.
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
            "text-xs font-medium whitespace-nowrap",
            // Only apply a preset tone class if NO custom color was given.
            !color && tones[tone],
            className,
         )}
         {...props}
      >
         {/* The optional leading dot. Uses the custom color if given,
             otherwise "currentColor" = the same color as the text. */}
         {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color ?? "currentColor" }} aria-hidden="true" />}
         {children}
      </span>
   );
}
