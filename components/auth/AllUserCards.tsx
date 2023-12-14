// @/app/(authenticated)/playground/CurrentUser.server.tsx

"use server";

import { Card } from "@/components/ui/card";

import { getCurrentUserOrNull } from "@/actions/user";
import { getRegisteredUserOrNull } from "@/actions/registeredUserActions";
import { getTemporaryUserOrNull } from "@/actions/temporaryUserActions";
import CurrentUserCard from "./CurrentUserCard";
import RegisteredUserCard from "./RegisteredUserCard";
import TemporaryUserCard from "./TemporaryUserCard";

type CardProps = React.ComponentProps<typeof Card>;

export interface AllUserCardsProps extends CardProps {}

export default async function AllUserCards(props: AllUserCardsProps) {
  const currentUser = await getCurrentUserOrNull();
  const temporaryUser = await getTemporaryUserOrNull();
  const registeredUser = await getRegisteredUserOrNull();
  return (
    <>
      <CurrentUserCard {...props} user={currentUser} />
      <TemporaryUserCard {...props} user={temporaryUser} />
      <RegisteredUserCard {...props} user={registeredUser} />
    </>
  );
}
