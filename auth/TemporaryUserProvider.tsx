// @/auth/temporary/TemporaryUserProvider.tsx

"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getOrResetTemporaryUser } from "../actions/temporaryUserActions";

import { UserAccountOrNullOrUndefined } from "@/types/user";

type TemporaryUserProviderProps = {
  children: ReactNode;
};

export function TemporaryUserProvider({ children }: TemporaryUserProviderProps): JSX.Element {
  const [temporaryUser, setTemporaryUser] = useState<UserAccountOrNullOrUndefined>(undefined);
  useEffect(() => {
    if (temporaryUser === undefined) {
      const initializeTemporaryUser = async () => {
        // Fetch current user by calling a server action
        try {
          const user = await getOrResetTemporaryUser();
          setTemporaryUser(user);
        } catch (exc) {
          console.log(`TemporaryUserProvider: exception in getOrResetTemporaryUser:`, exc);
        }
      };
      initializeTemporaryUser();
    }
  }, []); // Empty dependency array to run only once after component mounts

  return <TemporaryUserContext.Provider value={temporaryUser}>{children}</TemporaryUserContext.Provider>;
}

const TemporaryUserContext = createContext<UserAccountOrNullOrUndefined>(undefined);

export const useTemporaryUser = (): UserAccountOrNullOrUndefined => useContext(TemporaryUserContext);
