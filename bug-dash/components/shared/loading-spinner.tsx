import * as React from "react";
import { cn } from "@/lib/utils";

export type LoadingSpinnerSize = "sm" | "md" | "lg";

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  className?: string;
}

const sizeClasses: Record<LoadingSpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-blue-600 border-t-transparent",
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
