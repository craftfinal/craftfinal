import { SiteLogo } from "@/components/chrome/SiteLogo";
import { siteNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AuthenticatedContentLayoutChildrenProps } from "../../../layouts/AuthenticatedContentLayout";
import NavigationActionButtons from "./NavigationActionButtons";
import { NavigationMenuBar } from "./NavigationMenuBar";

export interface NavbarProps extends AuthenticatedContentLayoutChildrenProps {
  className?: string;
}
export default function Navbar({ account, className }: NavbarProps) {
  /*  space-x-1 sm:space-x-2 md:space-x-4 */
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-x-2 gap-y-4 align-baseline", className)}>
      <Link href={siteNavigation.home.href} title={siteNavigation.home.title} passHref>
        <SiteLogo />
      </Link>
      <NavigationMenuBar className="-mx-2" />
      <NavigationActionButtons account={account} />
    </div>
  );
}

export const menuClassName = {
  item: {
    text: "select-none leading-none no-underline outline-none transition-colors",
    container: "rounded-md px-2 lg:px-3",
  },
  topLevel: {
    text: "text-sm sm:text-base font-medium sm:leading-none lg:text-lg lg:leading-none",
    textColor: "text-muted-foreground hover:text-foreground",
    container: "min-h-[2rem] lg:min-h-[2.5rem] xl:min-h-[3rem]",
  },
  subItem: { container: "p-4 sm:p-2 md:p-3 lg:p-4" },
};
