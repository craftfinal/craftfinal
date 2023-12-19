"use server";

import { SiteLogo } from "@/components/chrome/SiteLogo";
import { siteNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import NavigationActionButtons from "./NavigationActionButtons";
import { NavigationMenuBar } from "./NavigationMenuBar";
import { NavbarProps } from "./NavbarProps";

export default async function Navbar({ account, className }: NavbarProps) {
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
