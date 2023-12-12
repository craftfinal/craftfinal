import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const brandTextVariants = cva(
  /* "font-bold text-3xl bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text hover:cursor-pointer", */
  "font-bold text-foreground",
  {
    variants: {
      variant: {
        default: "hover:text-primary",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 text-xl sm:h-12 sm:text-2xl md:h-15 md:text-3xl lg:h-18 lg:text-3xl xl:text-4xl",
        sm: "h-8 text-xs",
        lg: "h-10",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BrandTextProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brandTextVariants> {
  asChild?: boolean;
}

const LogoText = React.forwardRef<HTMLButtonElement, BrandTextProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(brandTextVariants({ variant, size }), className)} ref={ref} {...props}>
        {siteConfig.name}
      </Comp>
    );
  },
);
LogoText.displayName = "LogoText";

export { LogoText, brandTextVariants };
