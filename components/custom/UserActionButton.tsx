// @/app/(marketing)/(home)/EnterActionButton.tsx

import { NavItem } from "@/types";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import MainActionButton from "./MainActionButton";

interface UserActionButtonProps {
  account?: Base58CheckAccountOrNullOrUndefined;
  signedIn: NavItem;
  signedOut: NavItem;
}

export default function UserActionButton({ signedIn, signedOut, account }: Readonly<UserActionButtonProps>) {
  const navItem = account ? signedIn : signedOut;
  return <MainActionButton navItem={navItem} />;
}
