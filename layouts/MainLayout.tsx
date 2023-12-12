// @/layouts/MainLayout.tsx

import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { cn } from "@/lib/utils";
import { User as PrismaUser } from "@prisma/client";
import { PropsWithChildren } from "react";

export interface MainLayoutChildrenProps {
  user?: PrismaUser | null;
}

export interface MainLayoutProps extends PropsWithChildren {
  user?: PrismaUser | null;
  className?: string;
}
export default async function MainLayout({ user, className, children }: Readonly<MainLayoutProps>) {
  return (
    <>
      <SiteHeader user={user} />
      <main className={cn("my-auto min-h-screen", classNameMain.padding.y, className)}>{children}</main>
      <SiteFooter />
    </>
  );
}

// Define screen sizes for responsive design
const screenSizes = ["sm", "md", "lg", "xl"];

// Define space factor per screensize
const spaceScale = [4, 6, 8, 12, 16];

type SpaceType = "margin" | "padding";
const spaceTypePrefix = { margin: "m", padding: "p" };
type SpaceDirection = "x" | "y" | "t" | "b";
type ClassNameMainType = Record<SpaceType, Record<SpaceDirection, string>>;
// Function to generate padding class strings
const generateSpaceScale = (spaceType: SpaceType, paddingArray: number[]): ClassNameMainType[typeof spaceType] => {
  const createClassString = (direction: string) =>
    paddingArray
      .map((size, index) => `${index === 0 ? "" : screenSizes[index - 1] + ":"}${direction}-${size}`)
      .join(" ");

  return {
    x: createClassString(spaceTypePrefix[spaceType] + "x"),
    y: createClassString(spaceTypePrefix[spaceType] + "y"),
    t: createClassString(spaceTypePrefix[spaceType] + "t"),
    b: createClassString(spaceTypePrefix[spaceType] + "b"),
  };
};

// Generate the classNameMain object
export const classNameMain: ClassNameMainType = {
  margin: generateSpaceScale("margin", spaceScale),
  padding: generateSpaceScale("padding", spaceScale),
};
