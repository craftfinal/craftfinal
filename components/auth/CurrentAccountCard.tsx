// @/components/auth/CurrentAccountCard.tsx

"use server";

import { getCurrentAccountOrNull } from "@/actions/user";
import { AuthenticatedAccountCardProps } from "./AccountCard";
import AccountCard from "./AccountCard";

export default async function CurrentAccountCard(props: AuthenticatedAccountCardProps) {
  // Fetch current user on the server
  const account = await getCurrentAccountOrNull();
  return <AccountCard {...props} account={account} />;
}
