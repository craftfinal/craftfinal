// @/components/auth/RegisteredUserCard.tsx

"use server";

import { getRegisteredUserOrNull } from "@/actions/registeredUserActions";
import { AuthenticatedUserCardProps } from "./UserCard";
import UserCard from "./UserCard";

export default async function RegisteredUserCard({ user, ...props }: AuthenticatedUserCardProps) {
  // Fetch registered user on the server
  const registeredUser = user ?? (await getRegisteredUserOrNull());
  return <UserCard {...props} user={registeredUser} provider="registered" />;
}