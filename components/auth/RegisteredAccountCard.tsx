// @/components/auth/RegisteredAccountCard.tsx

"use server";

import { getRegisteredAccountOrNull } from "@/actions/registeredAccountActions";
import { AuthenticatedAccountCardProps } from "./AccountCard";
import AccountCard from "./AccountCard";

export default async function RegisteredAccountCard({ account, ...props }: AuthenticatedAccountCardProps) {
  // Fetch registered account on the server
  const registeredAccount = account ?? (await getRegisteredAccountOrNull());
  return <AccountCard {...props} account={registeredAccount} provider="registered" />;
}
