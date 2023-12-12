// @/layouts/MainLayout.tsx

import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { User as PrismaUser } from "@prisma/client";
import { PropsWithChildren } from "react";

export interface MainLayoutChildrenProps {
  user?: PrismaUser | null;
}

export interface MainLayoutProps extends PropsWithChildren {
  user?: PrismaUser | null;
  className?: string;
}
export default async function MainLayout({ user, children }: Readonly<MainLayoutProps>) {
  return (
    <>
      <SiteHeader user={user} />
      <main className="my-auto min-h-screen">{children}</main>
      <SiteFooter />
    </>
  );
}
