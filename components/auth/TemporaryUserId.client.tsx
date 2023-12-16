// @/components/auth/TemporaryAccountId.tsx

"use client";

import { useTemporaryAccount } from "@/auth/TemporaryAccountProvider";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { ReactNode } from "react";

export function TemporaryAccountId(): ReactNode {
  const temporaryUser: Base58CheckAccountOrNullOrUndefined = useTemporaryAccount();

  return <span>{temporaryUser?.id ?? ""}</span>;
}
