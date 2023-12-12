import * as React from "react";
import Navbar from "./navigation/Navbar";
import Breadcrumbs from "./navigation/breadcrumbs/Breadcrumbs";
import { AuthenticatedContentLayoutChildrenProps } from "@/app/(authenticated)/AuthenticatedContentLayout";

export interface SiteHeaderProps extends AuthenticatedContentLayoutChildrenProps {}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="container flex flex-col gap-y-2 pt-4 lg:gap-y-4 lg:pt-4">
      <Navbar user={user} />
      <Breadcrumbs />
    </header>
  );
}
