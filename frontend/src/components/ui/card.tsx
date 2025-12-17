import React from "react";
import { cn } from "@/lib/utils";

export const Card: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg",
      className
    )}
    {...props}
  />
);

export const CardHeader: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div className={cn("p-4 border-b border-slate-800", className)} {...props} />
);

export const CardTitle: React.FC<
  React.HTMLAttributes<HTMLHeadingElement>
> = ({ className, ...props }) => (
  <h2
    className={cn("text-lg font-semibold text-slate-50", className)}
    {...props}
  />
);

export const CardDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-slate-400", className)}
    {...props}
  />
);

export const CardContent: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div className={cn("p-4 space-y-3", className)} {...props} />
);
