// @/components/auth/RegisteredUserId.tsx

"use client";

import { RegisteredUser, useRegisteredUser } from "@/auth/RegisteredUserProvider";
import { ReactNode } from "react";

export function RegisteredUserId(): ReactNode {
  const registeredUser: RegisteredUser = useRegisteredUser();

  return <span>{registeredUser?.id ?? ""}</span>;
}
