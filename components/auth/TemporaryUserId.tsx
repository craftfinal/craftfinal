// @/components/auth/TemporaryUserId.tsx

"use client";

import { TemporaryUser, useTemporaryUser } from "@/auth/temporary/TemporaryUserContext";
import { ReactNode } from "react";

export default function TemporaryUserId(): ReactNode {
  const temporaryUser: TemporaryUser = useTemporaryUser();

  return !temporaryUser ? null : <div>{temporaryUser ? `Welcome, ${temporaryUser.id}` : "Not authenticated"}</div>;
}
