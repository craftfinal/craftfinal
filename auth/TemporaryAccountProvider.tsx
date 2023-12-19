// @/auth/temporary/TemporaryAccountProvider.tsx

"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getOrResetTemporaryAccount } from "@/actions/temporaryAccountActions";

import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";

type TemporaryAccountProviderProps = {
  children: ReactNode;
};

export function TemporaryAccountProvider({ children }: TemporaryAccountProviderProps): JSX.Element {
  const [temporaryAccount, setTemporaryAccount] = useState<Base58CheckAccountOrNullOrUndefined>(undefined);
  useEffect(() => {
    if (temporaryAccount === undefined) {
      const initializeTemporaryAccount = async () => {
        // Fetch current user by calling a server action
        try {
          const account = await getOrResetTemporaryAccount();
          setTemporaryAccount(account);
        } catch (exc) {
          console.log(`TemporaryAccountProvider: exception in getOrResetTemporaryAccount:`, exc);
        }
      };
      initializeTemporaryAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once after component mounts

  return <TemporaryAccountContext.Provider value={temporaryAccount}>{children}</TemporaryAccountContext.Provider>;
}

const TemporaryAccountContext = createContext<Base58CheckAccountOrNullOrUndefined>(undefined);

export const useTemporaryAccount = (): Base58CheckAccountOrNullOrUndefined => useContext(TemporaryAccountContext);
