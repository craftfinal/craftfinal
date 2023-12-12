import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { AppLogoSVG } from "./AppLogoSVG";

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
      default: "h-5 sm:h-6 lg:h-8 xl:h-10",
      sm: "h-6",
      lg: "h-10",
      icon: "h-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface BrandIconProps extends React.ImgHTMLAttributes<SVGSVGElement>, VariantProps<typeof brandIconVariants> {
  width?: number;
  height?: number;
}

const LogoImage = React.forwardRef<SVGSVGElement, BrandIconProps>(({ variant, size, width, height, ...props }, ref) => {
  const imageWidth = width ?? 96;
  const imageHeight = height ?? width ?? 96;
  return (
    <AppLogoSVG
      ref={ref}
      className={cn("w-auto", brandIconVariants({ variant, size }))}
      alt={`${siteConfig.name} logo`}
      width={imageWidth}
      height={imageHeight}
      {...props}
    />
  );
});
LogoImage.displayName = "LogoImage";

export { brandIconVariants, LogoImage };
