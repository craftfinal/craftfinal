import { SiteLogo } from "@/components/layout/SiteLogo";
import Link from "next/link";
import { AuthenticatedContentLayoutChildrenProps } from "../../../app/(authenticated)/AuthenticatedContentLayout";
import NavigationActionButtons from "./NavigationActionButtons";
import { NavigationMenuBar } from "./NavigationMenuBar";

export interface NavbarProps extends AuthenticatedContentLayoutChildrenProps {}
export default function Navbar({ user }: NavbarProps) {
  return (
    <div className="flex flex-wrap justify-between gap-x-2 pt-4 align-baseline md:pb-2 lg:pb-3">
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
