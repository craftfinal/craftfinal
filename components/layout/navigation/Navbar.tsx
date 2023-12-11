import { Logo } from "@/components/custom/Logo";
import Link from "next/link";
import { AuthenticatedContentLayoutChildrenProps } from "../../../app/(authenticated)/AuthenticatedContentLayout";
import NavigationActionButtons from "./NavigationActionButtons";
import { NavigationMenuBar } from "./NavigationMenuBar";

export interface NavbarProps extends AuthenticatedContentLayoutChildrenProps {}
export default function Navbar({ user }: NavbarProps) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-4 pb-4 pt-4 align-baseline">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-4">
        <Link href="/">
          <Logo />
        </Link>
        <NavigationMenuBar />
      </div>
      <NavigationActionButtons user={user} />
    </div>
  );
}
