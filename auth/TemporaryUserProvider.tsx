// @/auth/temporary/TemporaryAuthProvider.tsx

"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getTemporaryUser } from "../actions/temporaryUserActions";

import type { User as PrismaUser } from "@prisma/client";

export type TemporaryUser = PrismaUser | null | undefined;

type TemporaryAuthProviderProps = {
  children: ReactNode;
};

export function TemporaryUserProvider({ children }: TemporaryAuthProviderProps): JSX.Element {
  const [temporaryUser, setTemporaryUser] = useState<PrismaUser | null | undefined>(undefined);

  useEffect(() => {
    async function initializeAuthUser() {
      const authUser = await getTemporaryUser();
      setTemporaryUser(authUser);
    }
    if (temporaryUser === undefined) {
      initializeAuthUser();
    }
  }, [temporaryUser]);

  return <TemporaryUserContext.Provider value={temporaryUser}>{children}</TemporaryUserContext.Provider>;
}

const TemporaryUserContext = createContext<TemporaryUser>(undefined);

export const useTemporaryUser = (): TemporaryUser => useContext(TemporaryUserContext);
