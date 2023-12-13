"use client";

import type { User as PrismaUser } from "@prisma/client";
import { createContext, useContext } from "react";
export type TemporaryUser = PrismaUser | null;

export const TemporaryUserContext = createContext<TemporaryUser>(null);

export function useTemporaryUser(): TemporaryUser {
  return useContext(TemporaryUserContext);
}
