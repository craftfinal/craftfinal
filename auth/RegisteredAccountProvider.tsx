// @/auth/temporary/RegisteredAccountProvider.tsx

"use client";

import { getRegisteredAccountOrNull } from "@/actions/registeredAccountActions";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type RegisteredAccountProviderProps = {
  children: ReactNode;
};
export function RegisteredAccountProvider({ children }: RegisteredAccountProviderProps): JSX.Element {
  const [registeredAccount, setRegisteredAccount] = useState<Base58CheckAccountOrNullOrUndefined>(undefined);
  useEffect(() => {
    if (registeredAccount === undefined) {
      const initializeRegisteredAccount = async () => {
        // Fetch current user by calling a server action
        const account = await getRegisteredAccountOrNull();
        setRegisteredAccount(account);
      };
      initializeRegisteredAccount();
    }
  }, []); // Empty dependency array to run only once after component mounts

  return <RegisteredAccountContext.Provider value={registeredAccount}>{children}</RegisteredAccountContext.Provider>;
}

export const RegisteredAccountContext = createContext<Base58CheckAccountOrNullOrUndefined>(undefined);

export const useRegisteredAccount = (): Base58CheckAccountOrNullOrUndefined => useContext(RegisteredAccountContext);
