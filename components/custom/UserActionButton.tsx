// @/app/(marketing)/(home)/EnterActionButton.tsx

import { NavItem } from "@/types";
import { UserAccountOrNullOrUndefined } from "@/types/user";
import MainActionButton from "./MainActionButton";

interface UserActionButtonProps {
  user?: UserAccountOrNullOrUndefined;
  signedIn: NavItem;
  signedOut: NavItem;
}

export default function UserActionButton({ signedIn, signedOut, user }: Readonly<UserActionButtonProps>) {
  const navItem = user ? signedIn : signedOut;
  return <MainActionButton navItem={navItem} />;
}
