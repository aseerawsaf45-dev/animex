import * as React from "react";
import { cn } from "@/lib/utils";

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse rounded-[8px] bg-white/5",
        className
      )}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

// Anime card skeleton
export function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="aspect-[2/3] w-full rounded-[14px]" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

// Section skeleton with header
export function SectionSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-white/10 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: cards }).map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { Skeleton };
