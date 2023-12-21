// @/app/(authenticated)/playground/CurrentAccount.server.tsx

"use server";

import { Card } from "@/components/ui/card";

import { getRegisteredAccountOrNull } from "@/actions/registeredAccountActions";
import { getCurrentAccountOrNull } from "@/actions/user";
import CurrentAccountCard from "./CurrentAccountCard";
import RegisteredAccountCard from "./RegisteredAccountCard";
import IronSessionAccountCard from "./IronSessionAccountCard";
import { getIronSessionAccountOrNull } from "@/auth/iron-session/ironSessionActions";

type CardProps = React.ComponentProps<typeof Card>;

export interface AllAccountCardsProps extends CardProps {}

export default async function AllAccountCards(props: AllAccountCardsProps) {
  const currentAccount = await getCurrentAccountOrNull();
  const ironSessionAccount = await getIronSessionAccountOrNull();
  const registeredAccount = await getRegisteredAccountOrNull();
  return (
    <>
      <CurrentAccountCard {...props} account={currentAccount} />
      <IronSessionAccountCard {...props} account={ironSessionAccount} />
      <RegisteredAccountCard {...props} account={registeredAccount} />
    </>
  );
}
