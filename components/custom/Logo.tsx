import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import React from "react";

const logoImageVariants = cva("font-bold text-foreground", {
  variants: {
    variant: {
      default: "",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "",
    },
    size: {
      default: "h-9 w-9 sm:h-12 sm:w-12 md:h-[4rem] md:w-[4rem] lg:h-[5rem] lg:w-[5rem] xl:h-24 xl:w-24",
      sm: "h-8 w-10",
      lg: "h-10 w-10",
      icon: "h-9 w-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const logoVariants = cva(
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
        default: "h-9 text-xl sm:h-12 sm:text-2xl md:h-15 md:text-3xl lg:h-18 lg:text-3xl xl:h-24 xl:text-4xl",
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

export interface LogoProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof logoVariants> {
  asChild?: boolean;
}

const Logo = React.forwardRef<HTMLButtonElement, LogoProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const width = 96,
      height = 96;
    const Comp = asChild ? Slot : "button";
    return (
      <div className={cn("flex items-center gap-x-1 hover:cursor-pointer", className)}>
        <Image
          className={cn(logoImageVariants({ variant, size }))}
          src="images/logo.svg"
          alt={`${siteConfig.name} logo`}
          width={width}
          height={height}
          loading="eager"
          fetchPriority="high"
        />
        <Comp className={cn(logoVariants({ variant, size }))} ref={ref} {...props}>
          {siteConfig.name}
        </Comp>
      </div>
    );
  },
);
Logo.displayName = "Logo";

export { Logo, logoVariants };
