import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "whatsapp" | "white";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      isExternal = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes guaranteeing min 44px touch target on mobile
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none touch-target active:scale-[0.98]";

    const sizeClasses = {
      sm: "text-xs px-4 py-2 min-h-[44px] gap-1.5",
      md: "text-sm sm:text-base px-5 py-2.5 min-h-[46px] gap-2 font-semibold",
      lg: "text-base sm:text-lg px-7 py-3.5 min-h-[52px] gap-2.5 font-bold tracking-tight shadow-clinical",
    };

    const variantClasses = {
      primary:
        "bg-primary text-white hover:bg-primary-dark active:bg-[#040E1E] shadow-clinical border border-transparent",
      secondary:
        "bg-secondary text-white hover:bg-secondary-dark active:bg-[#014953] shadow-clinical border border-transparent",
      accent:
        "bg-accent text-white hover:bg-accent-dark active:bg-[#047857] shadow-clinical border border-transparent",
      whatsapp:
        "bg-[#25D366] text-white hover:bg-[#1EBE5D] active:bg-[#169C4B] shadow-clinical border border-transparent",
      outline:
        "border-2 border-primary/20 text-primary hover:border-primary hover:bg-primary/5 active:bg-primary/10",
      ghost:
        "text-slate-700 hover:text-primary hover:bg-slate-100 active:bg-slate-200 border border-transparent",
      white:
        "bg-white text-primary hover:bg-slate-50 active:bg-slate-100 shadow-clinical border border-slate-200/80",
    };

    const combinedClasses = cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      fullWidth ? "w-full" : "",
      className
    );

    if (href) {
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClasses}
          >
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </a>
        );
      }

      return (
        <Link href={href} className={combinedClasses}>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={combinedClasses}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
