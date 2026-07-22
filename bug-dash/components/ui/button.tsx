// forwardRef lets a parent component grab a direct reference to the actual
// <button> DOM element (needed for focus management, form libraries, etc.)
import { forwardRef } from "react";
// cn = a helper that merges Tailwind class strings together cleanly
import { cn } from "@/lib/utils";

// The five visual styles this button can have.
type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
// The four sizes it can be. ("icon" = a square button for a lone icon.)
type Size = "sm" | "md" | "lg" | "icon";

// Look up table: each variant name -> the Tailwind classes that style it.
// The colors all come from your CSS variables (--primary, --danger, etc.)
// so the whole app stays consistent and is easy to re-theme.
const variants: Record<Variant, string> = {
   primary: "bg-[var(--primary)] text-[var(--primary-fg)] hover:bg-[var(--primary-hover)] shadow-sm",
   secondary: "bg-[var(--surface-2)] text-[var(--fg)] hover:bg-[var(--border)]",
   outline: "border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)]",
   ghost: "text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
   danger: "bg-[var(--danger)] text-[var(--danger-fg)] hover:bg-[var(--danger-hover)] shadow-sm",
};

// Look up table: each size name -> its height, horizontal padding,
// text size, and gap (space between the spinner/icon and the label).
const sizes: Record<Size, string> = {
   sm: "h-8 px-3 text-sm gap-1.5",
   md: "h-9 px-4 text-sm gap-2",
   lg: "h-11 px-6 text-base gap-2",
   icon: "h-9 w-9",
};

// The props this button accepts. It extends the normal HTML <button> props
// (onClick, type, etc.) and adds our three custom ones below.
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: Variant; // which style — defaults to "primary"
   size?: Size; // which size — defaults to "md"
   loading?: boolean; // if true, show a spinner and disable the button
}

// The actual component.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
   // Pull out our custom props; everything else (onClick, type...) is in `...props`.
   ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
      return (
         <button
            ref={ref}
            // Disable the button if it's explicitly disabled OR currently loading.
            disabled={disabled || loading}
            className={cn(
               // Base styles that apply to every button, regardless of variant/size:
               "inline-flex items-center justify-center rounded-[var(--radius)] font-medium",
               "transition-colors outline-none",
               // The keyboard focus ring (only shows when tabbing, not on mouse click):
               "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
               // When disabled: fade it out and ignore clicks.
               "disabled:pointer-events-none disabled:opacity-50",
               // Add the variant + size classes from the look up tables above.
               variants[variant],
               sizes[size],
               // Any extra classes passed in from outside come last, so they can override.
               className,
            )}
            // Spread the remaining native props (onClick, type, etc.) onto the button.
            {...props}
         >
            {/* If loading is true, show a spinning circle before the text. */}
            {loading && (
               <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {/* The faint full ring */}
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  {/* The brighter quarter-arc that makes it look like it's spinning */}
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
               </svg>
            )}
            {/* The button's label / content, e.g. "New issue" */}
            {children}
         </button>
      );
   },
);

// Gives the component a readable name in React DevTools (forwardRef needs this set manually).
Button.displayName = "Button";
