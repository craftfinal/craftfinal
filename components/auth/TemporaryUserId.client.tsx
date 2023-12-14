// @/components/auth/TemporaryUserId.tsx

"use client";

import { useTemporaryUser } from "@/auth/TemporaryUserProvider";
import { UserAccountOrNullOrUndefined } from "@/types/user";
import { ReactNode } from "react";

export function TemporaryUserId(): ReactNode {
  const temporaryUser: UserAccountOrNullOrUndefined = useTemporaryUser();

  return <span>{temporaryUser?.id ?? ""}</span>;
}
