// @/components/auth/TemporaryUserId.tsx

"use client";

import { TemporaryUser, useTemporaryUser } from "@/auth/TemporaryUserProvider";
import { ReactNode } from "react";

export function TemporaryUserId(): ReactNode {
  const temporaryUser: TemporaryUser = useTemporaryUser();

  return <span>{temporaryUser?.id ?? ""}</span>;
}
