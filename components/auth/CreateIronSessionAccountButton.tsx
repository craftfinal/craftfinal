// @/components/auth/CurrentAccountCardClient.tsx
"use client";

import { getOrCreateIronSessionAccount } from "@/auth/iron-session/ironSessionActions";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

export function CreateIronSessionAccountButton({
  setCurrentAccount,
}: {
  setCurrentAccount: Dispatch<SetStateAction<Base58CheckAccountOrNullOrUndefined>>;
}) {
  const handleClick = async () => {
    const newAccount = await getOrCreateIronSessionAccount();
    setCurrentAccount(newAccount);
  };

  return <Button onClick={handleClick}>Create playground account</Button>;
}
