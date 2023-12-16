import { AuthenticatedContentLayoutChildrenProps } from "@/layouts/AuthenticatedContentLayout";
import Navbar from "./navigation/Navbar";
import Breadcrumbs from "./navigation/breadcrumbs/Breadcrumbs";

export interface SiteHeaderProps extends AuthenticatedContentLayoutChildrenProps {}

export function SiteHeader({ account }: SiteHeaderProps) {
  return (
    <header className="md:pt-4lg:gap-y-4 container flex flex-col gap-y-2 pt-4 sm:pt-2 lg:pt-6 xl:pt-10">
      <Navbar account={account} />
      <Breadcrumbs />
    </header>
  );
}
