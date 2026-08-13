import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-label text-[10px] font-bold uppercase tracking-[0.08em] rounded-[4px] px-2 py-0.5",
  {
    variants: {
      variant: {
        match: "bg-[#D32F2F] text-white",
        genre: "bg-white/5 text-[#FAF8F3]/70 border border-white/10",
        status: "bg-[#222222] text-[#FAF8F3]/60 border border-white/8",
        score: "bg-[#1A1A1A] text-[#D32F2F] border border-[#D32F2F]/30",
        new: "bg-[#D32F2F]/15 text-[#D32F2F] border border-[#D32F2F]/25",
      },
    },
    defaultVariants: {
      variant: "genre",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
