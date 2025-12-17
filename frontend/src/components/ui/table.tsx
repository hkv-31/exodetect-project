import React from "react";
import { cn } from "@/lib/utils";

export const Table: React.FC<
  React.TableHTMLAttributes<HTMLTableElement>
> = ({ className, ...props }) => (
  <table
    className={cn(
      "w-full text-sm border-collapse border border-slate-800",
      className
    )}
    {...props}
  />
);

export const THead: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ className, ...props }) => (
  <thead className={cn("bg-slate-900", className)} {...props} />
);

export const TBody: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ className, ...props }) => (
  <tbody className={cn("divide-y divide-slate-800", className)} {...props} />
);

export const TR: React.FC<
  React.HTMLAttributes<HTMLTableRowElement>
> = ({ className, ...props }) => (
  <tr className={cn("hover:bg-slate-900/60", className)} {...props} />
);

export const TH: React.FC<
  React.ThHTMLAttributes<HTMLTableCellElement>
> = ({ className, ...props }) => (
  <th
    className={cn(
      "px-3 py-2 text-left text-xs font-semibold text-slate-300",
      className
    )}
    {...props}
  />
);

export const TD: React.FC<
  React.TdHTMLAttributes<HTMLTableCellElement>
> = ({ className, ...props }) => (
  <td
    className={cn("px-3 py-2 text-xs text-slate-200", className)}
    {...props}
  />
);
