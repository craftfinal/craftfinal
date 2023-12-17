// @/app/(marketing)/(home)/EnterActionButton.tsx

import { NavItem } from "@/types";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import MainActionButton from "./MainActionButton";

interface UserActionButtonProps {
  account?: Base58CheckAccountOrNullOrUndefined;
  signedIn: NavItem;
  signedOut: NavItem;
  prefetch?: boolean;
}

export default function UserActionButton({ signedIn, signedOut, account, prefetch }: Readonly<UserActionButtonProps>) {
  const navItem = account ? signedIn : signedOut;
  const navPrefetch = prefetch !== undefined ? prefetch : !navItem.authenticated;
  return <MainActionButton navItem={navItem} prefetch={navPrefetch} />;
}
