// @/auth/temporary/TemporaryAuthProvider.tsx

"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getTemporaryUserOrNull } from "../actions/temporaryUserActions";

import { UserAccountOrNullOrUndefined } from "@/types/user";

type TemporaryUserProviderProps = {
  children: ReactNode;
};

export function TemporaryUserProvider({ children }: TemporaryUserProviderProps): JSX.Element {
  const [temporaryUser, setTemporaryUser] = useState<UserAccountOrNullOrUndefined>(undefined);

  useEffect(() => {
    async function initializeAuthUser() {
      const authUser = await getTemporaryUserOrNull();
      setTemporaryUser(authUser);
    }
    if (temporaryUser === undefined) {
      initializeAuthUser();
    }
  }, [temporaryUser]);

  return <TemporaryUserContext.Provider value={temporaryUser}>{children}</TemporaryUserContext.Provider>;
}

const TemporaryUserContext = createContext<UserAccountOrNullOrUndefined>(undefined);

export const useTemporaryUser = (): UserAccountOrNullOrUndefined => useContext(TemporaryUserContext);
