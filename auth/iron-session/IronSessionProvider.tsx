// @/auth/iron-session/IronSessionProvider.tsx

"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getOrResetIronSession } from "./ironSessionActions";

import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";

type IronSessionProviderProps = {
  children: ReactNode;
};

export function IronSessionProvider({ children }: IronSessionProviderProps): JSX.Element {
  const [ironSession, setIronSession] = useState<Base58CheckAccountOrNullOrUndefined>(undefined);
  useEffect(() => {
    if (ironSession === undefined) {
      const initializeIronSession = async () => {
        // Fetch current user by calling a server action
        try {
          const account = await getOrResetIronSession();
          setIronSession(account);
        } catch (exc) {
          console.log(`IronSessionProvider: exception in getOrResetIronSession:`, exc);
        }
      };
      initializeIronSession();
    }
  }, []); // Empty dependency array to run only once after component mounts

  return <IronSessionContext.Provider value={ironSession}>{children}</IronSessionContext.Provider>;
}

const IronSessionContext = createContext<Base58CheckAccountOrNullOrUndefined>(undefined);

export const useIronSession = (): Base58CheckAccountOrNullOrUndefined => useContext(IronSessionContext);
