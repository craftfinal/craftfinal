// @/components/auth/CurrentAccountCardClient.tsx

"use client";

import { getIronSessionAccountOrNull } from "@/auth/iron-session/ironSessionActions";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { useEffect, useState } from "react";
import { AuthenticatedAccountCardProps } from "./AccountCard";
import AccountCardClient from "./AccountCard.client";
import { CreateIronSessionAccountButton } from "./CreateIronSessionAccountButton";

export default function CurrentAccountCardClient({ account }: AuthenticatedAccountCardProps) {
  const [currentAccount, setCurrentAccount] = useState<Base58CheckAccountOrNullOrUndefined>(account);

  useEffect(() => {
    if (currentAccount === undefined) {
      // Async function to get account
      const fetchAccount = async () => {
        // const fetchedAccount = await getOrCreateIronSessionAccount();
        const fetchedAccount = await getIronSessionAccountOrNull();
        setCurrentAccount(fetchedAccount ?? null);
      };
      fetchAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return currentAccount ? (
    <AccountCardClient account={currentAccount} />
  ) : (
    <CreateIronSessionAccountButton setCurrentAccount={setCurrentAccount} />
  );
}
