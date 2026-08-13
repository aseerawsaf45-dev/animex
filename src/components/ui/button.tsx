import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-label uppercase tracking-widest text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D32F2F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#D32F2F] text-white hover:bg-[#8F1D1D] shadow-[0_4px_20px_rgba(211,47,47,0.3)] hover:shadow-[0_6px_28px_rgba(211,47,47,0.45)]",
        secondary:
          "border border-white/20 text-[#FAF8F3] hover:border-[#FAF8F3] hover:bg-white/5",
        ghost:
          "text-[#FAF8F3]/70 hover:text-[#D32F2F] hover:bg-white/5",
        outline:
          "border border-[#D32F2F]/40 text-[#D32F2F] hover:bg-[#D32F2F]/10",
        destructive:
          "bg-[#8F1D1D] text-white hover:bg-[#D32F2F]",
      },
      size: {
        sm: "h-8 px-4 text-xs rounded-[8px]",
        md: "h-11 px-6 rounded-[10px]",
        lg: "h-13 px-8 text-base rounded-[12px]",
        icon: "h-9 w-9 rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
