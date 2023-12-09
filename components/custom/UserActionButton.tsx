// @/app/(marketing)/(home)/EnterActionButton.tsx

import { NavItem } from "@/types";
import { User as PrismaUser } from "@prisma/client";
import MainActionButton from "./MainActionButton";

interface UserActionButtonProps {
  user?: PrismaUser | null;
  signedIn: NavItem;
  signedOut: NavItem;
}

export default function UserActionButton({ signedIn, signedOut, user }: Readonly<UserActionButtonProps>) {
  const navItem = user ? signedIn : signedOut;
  return <MainActionButton navItem={navItem} />;
}
