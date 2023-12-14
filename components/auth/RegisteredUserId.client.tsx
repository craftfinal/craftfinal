// @/components/auth/RegisteredUserId.tsx

"use client";

import { useRegisteredUser } from "@/auth/RegisteredUserProvider";
import { UserAccountOrNullOrUndefined } from "@/types/user";
import { ReactNode } from "react";

export function RegisteredUserId(): ReactNode {
  const registeredUser: UserAccountOrNullOrUndefined = useRegisteredUser();

  return <span>{registeredUser?.id ?? ""}</span>;
}
