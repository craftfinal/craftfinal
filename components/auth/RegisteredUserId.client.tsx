// @/components/auth/RegisteredAccountId.tsx

"use client";

import { useRegisteredAccount } from "@/auth/RegisteredAccountProvider";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { ReactNode } from "react";

export function RegisteredAccountId(): ReactNode {
  const registeredUser: Base58CheckAccountOrNullOrUndefined = useRegisteredAccount();

  return <span>{registeredUser?.id ?? ""}</span>;
}
