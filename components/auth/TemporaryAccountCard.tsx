// @/components/auth/TemporaryAccountCard.tsx

"use server";

import { getTemporaryAccountOrNull } from "@/actions/temporaryAccountActions";
import AccountCard, { AuthenticatedAccountCardProps } from "./AccountCard";

export default async function TemporaryAccountCard({ account, ...props }: AuthenticatedAccountCardProps) {
  // Fetch temporary account on the server
  const temporaryAccount = account ?? (await getTemporaryAccountOrNull());
  return <AccountCard {...props} account={temporaryAccount} provider="temporary" />;
}
