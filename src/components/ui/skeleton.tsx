import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Base skeleton pulse                                                */
/* ------------------------------------------------------------------ */

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}
Skeleton.displayName = "Skeleton";

/* ------------------------------------------------------------------ */
/*  Skeleton line (text placeholder)                                   */
/* ------------------------------------------------------------------ */

function SkeletonLine({
  className,
  width = "w-full",
}: {
  className?: string;
  width?: string;
}) {
  return <Skeleton className={cn("h-4", width, className)} />;
}
SkeletonLine.displayName = "SkeletonLine";

/* ------------------------------------------------------------------ */
/*  Skeleton card                                                      */
/* ------------------------------------------------------------------ */

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 space-y-4",
        className
      )}
    >
      <Skeleton className="h-5 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
SkeletonCard.displayName = "SkeletonCard";

/* ------------------------------------------------------------------ */
/*  Skeleton table                                                     */
/* ------------------------------------------------------------------ */

function SkeletonTable({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-gray-200", className)}>
      {/* Header */}
      <div className="flex gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4"
            style={{ width: `${100 / cols}%` }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={cn(
            "flex gap-4 px-4 py-3",
            rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
          )}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className="h-4"
              style={{ width: `${100 / cols}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
SkeletonTable.displayName = "SkeletonTable";

export { Skeleton, SkeletonLine, SkeletonCard, SkeletonTable };
