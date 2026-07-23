import * as React from "react";
import { cn } from "@/lib/utils";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.ComponentProps<"div"> {
  variant?: AlertVariant;
  title?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  success: "border-green-200 bg-green-50 text-green-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
  error: "border-red-200 bg-red-50 text-red-600",
};

export function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children && <AlertDescription>{children}</AlertDescription>}
    </div>
  );
}

export function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("mb-1 font-medium leading-none", className)} {...props} />
  );
}

export function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-sm", className)} {...props} />;
}

export default Alert;
