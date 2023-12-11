import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import React from "react";
import { LogoImage, BrandIconProps } from "./logo/LogoImage";
import { LogoText, BrandTextProps, brandTextVariants } from "./logo/LogoText";

export interface SiteLogoProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof brandTextVariants> {
  asChild?: boolean;
}

const SiteLogo = React.forwardRef<HTMLDivElement, SiteLogoProps>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp className={cn("flex items-center gap-x-2 hover:cursor-pointer md:gap-x-3", className)} ref={ref}>
      <LogoImage {...(props as BrandIconProps)} fetchPriority="high" />
      <LogoText {...(props as BrandTextProps)}>{siteConfig.name}</LogoText>
    </Comp>
  );
});
SiteLogo.displayName = "SiteLogo";

export { SiteLogo };
