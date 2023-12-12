import { SiteLogo } from "@/components/chrome/SiteLogo";
import Link from "next/link";
import { AuthenticatedContentLayoutChildrenProps } from "../../../app/(authenticated)/AuthenticatedContentLayout";
import NavigationActionButtons from "./NavigationActionButtons";
import { NavigationMenuBar } from "./NavigationMenuBar";

export interface NavbarProps extends AuthenticatedContentLayoutChildrenProps {}
export default function Navbar({ user }: NavbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-2 align-baseline">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-4">
        <Link href="/">
          <SiteLogo />
        </Link>
        <NavigationMenuBar />
      </div>
      <NavigationActionButtons user={user} />
    </div>
  );
}

export const menuClassName = {
  item: {
    text: "select-none leading-none no-underline outline-none transition-colors",
    container: "rounded-md p-2 sm:p-3",
  },
  topLevel: {
    text: "text-base font-medium sm:leading-none md:text-lg md:leading-none",
    textColor: "text-muted-foreground hover:text-foreground",
    container: "h-9 sm:h-10 lg:h-12",
  },
  subItem: { container: "p-1 sm:p-2 md:p-3 lg:p-4" },
};
