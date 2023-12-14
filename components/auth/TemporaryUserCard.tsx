// @/components/auth/TemporaryUserCard.tsx

"use server";

import { getTemporaryUserOrNull } from "@/actions/temporaryUserActions";
import UserCard, { AuthenticatedUserCardProps } from "./UserCard";

export default async function TemporaryUserCard({ user, ...props }: AuthenticatedUserCardProps) {
  // Fetch temporary user on the server
  const temporaryUser = user ?? (await getTemporaryUserOrNull());
  return <UserCard {...props} user={temporaryUser} provider="temporary" />;
}
