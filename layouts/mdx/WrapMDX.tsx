// @/layouts/WrapMDX.tsx

import { MainLayoutProps } from "@/layouts/MainLayout";
import { cn } from "@/lib/utils";
import { ElementType } from "react";

export interface WrapMDXProps extends MainLayoutProps {
  as?: ElementType; // ElementType represents any valid HTML element type
}

export default function WrapMDX({
  as: Component = "div", // Default to 'div' if not provided
  className,
  children,
}: Readonly<WrapMDXProps>) {
  return <Component className={cn("prose dark:prose-invert md:prose-lg lg:prose-xl", className)}>{children}</Component>;
}

export const proseClassName = "prose dark:prose-invert md:prose-lg lg:prose-xl";
