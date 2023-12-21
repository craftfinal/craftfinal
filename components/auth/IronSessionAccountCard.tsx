// @/components/auth/IronSessionAccountCard.tsx

"use server";

import { getIronSessionAccountOrNull } from "@/auth/iron-session/ironSessionActions";
import AccountCard, { AuthenticatedAccountCardProps } from "./AccountCard";

export default async function IronSessionAccountCard({ account, ...props }: AuthenticatedAccountCardProps) {
  // Fetch temporary account on the server
  const ironSessionAccount = account ?? (await getIronSessionAccountOrNull());
  return <AccountCard {...props} account={ironSessionAccount} provider="temporary" />;
}
