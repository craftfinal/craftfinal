// @/app/(authenticated)/playground/CurrentAccount.server.tsx

"use server";

import { Card } from "@/components/ui/card";

import { getRegisteredAccountOrNull } from "@/actions/registeredAccountActions";
import { getTemporaryAccountOrNull } from "@/actions/temporaryAccountActions";
import { getCurrentAccountOrNull } from "@/actions/user";
import CurrentAccountCard from "./CurrentAccountCard";
import RegisteredAccountCard from "./RegisteredAccountCard";
import TemporaryAccountCard from "./TemporaryAccountCard";

type CardProps = React.ComponentProps<typeof Card>;

export interface AllAccountCardsProps extends CardProps {}

export default async function AllAccountCards(props: AllAccountCardsProps) {
  const currentAccount = await getCurrentAccountOrNull();
  const temporaryAccount = await getTemporaryAccountOrNull();
  const registeredAccount = await getRegisteredAccountOrNull();
  return (
    <>
      <CurrentAccountCard {...props} account={currentAccount} />
      <TemporaryAccountCard {...props} account={temporaryAccount} />
      <RegisteredAccountCard {...props} account={registeredAccount} />
    </>
  );
}
