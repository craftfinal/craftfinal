// @/layouts/MainLayout.tsx

import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { cn } from "@/lib/utils";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { PropsWithChildren } from "react";

export interface MainLayoutChildrenProps {
  account?: Base58CheckAccountOrNullOrUndefined;
}

export interface MainLayoutProps extends PropsWithChildren {
  account?: Base58CheckAccountOrNullOrUndefined;
  className?: string;
}
export default async function MainLayout({ account: account, className, children }: Readonly<MainLayoutProps>) {
  return (
    <>
      <SiteHeader account={account} />
      <main className={cn("my-auto min-h-screen", paddingScale.y, className)}>{children}</main>
      <SiteFooter />
    </>
  );
}

// Define screen sizes for responsive design
const screenSizes = ["sm", "md", "lg", "xl"];

// Define space factor per screen size
const spaceScale = [4, 6, 8, 12, 16];

// Define space scales for margin (prefix `m`) and padding (prefix `p`)
type SpaceType = "m" | "p";
// Define space scales for horizontal (prefix `x`), vertical (prefix `y`),
// top (prefix `t`) and bottom (prefix `b`)
type SpaceDirection = "x" | "y" | "t" | "b";
type ClassNameMainType = Record<SpaceType, Record<SpaceDirection, string>>;

// Function to generate space class strings
const generateSpaceScale = (spaceType: SpaceType): ClassNameMainType[typeof spaceType] => {
  const createClassString = (direction: string) =>
    spaceScale
      .map((size, index) => `${index === 0 ? "" : screenSizes[index - 1] + ":"}${spaceType}${direction}-${size}`)
      .join(" ");

  return {
    x: createClassString("x"),
    y: createClassString("y"),
    t: createClassString("t"),
    b: createClassString("b"),
  };
};

// Generate the classNameMain object
export const classNameMain: ClassNameMainType = {
  m: generateSpaceScale("m"),
  p: generateSpaceScale("p"),
};

export const paddingScale = generateSpaceScale("p");
export const marginScale = generateSpaceScale("m");
