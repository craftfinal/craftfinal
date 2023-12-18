import { AuthenticatedContentLayoutChildrenProps } from "@/layouts/AuthenticatedContentLayout";
import Navbar from "./navigation/Navbar";
import Breadcrumbs from "./navigation/breadcrumbs/Breadcrumbs";

export interface SiteHeaderProps extends AuthenticatedContentLayoutChildrenProps {}

export function SiteHeader({ account }: SiteHeaderProps) {
  return (
    <header className="container flex flex-col gap-y-2 pt-4  md:pt-6 lg:gap-y-4 lg:pt-10">
      <Navbar account={account} />
      <Breadcrumbs />
    </header>
  );
}
