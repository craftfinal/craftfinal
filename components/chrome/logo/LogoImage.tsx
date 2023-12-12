import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import React from "react";

const brandIconVariants = cva("font-bold text-foreground", {
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
      default: "h-6 w-6 md:h-8 md:w-8 md:h-9 md:w-9 xl:h-10 xl:w-10",
      sm: "h-6 w-6",
      lg: "h-10 w-10",
      icon: "h-9 w-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface BrandIconProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof brandIconVariants> {
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "auto" | "high" | "low";
}

const LogoImage = React.forwardRef<HTMLImageElement, BrandIconProps>(
  ({ variant, size, width, height, priority, loading, fetchPriority, ...props }, ref) => {
    const imageWidth = width ?? 96;
    const imageHeight = height ?? width ?? 96;
    return (
      <Image
        ref={ref}
        className={cn(brandIconVariants({ variant, size }))}
        src={siteConfig.logo}
        alt={`${siteConfig.name} logo`}
        width={imageWidth}
        height={imageHeight}
        loading={loading ?? "eager"}
        fetchPriority={fetchPriority ?? "auto"}
        priority={priority ?? true}
        {...props}
      />
    );
  },
);
LogoImage.displayName = "LogoImage";

export { LogoImage, brandIconVariants };
