// @/components/auth/CurrentUserCard.tsx

"use server";

import { getCurrentUserOrNull } from "@/actions/user";
import { AuthenticatedUserCardProps } from "./UserCard";
import UserCard from "./UserCard";

export default async function CurrentUserCard(props: AuthenticatedUserCardProps) {
  // Fetch current user on the server
  const user = await getCurrentUserOrNull();
  return <UserCard {...props} user={user} />;
}
