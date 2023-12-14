"use client";

import { UserAccountOrNullOrUndefined } from "@/types/user";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getRegisteredUserOrNull } from "../actions/registeredUserActions";

type RegisteredUserProviderProps = {
  children: ReactNode;
};
export function RegisteredUserProvider({ children }: RegisteredUserProviderProps): JSX.Element {
  const [registeredUser, setRegisteredUser] = useState<UserAccountOrNullOrUndefined>(undefined);

  useEffect(() => {
    async function initializeAuthUser() {
      const authUser = await getRegisteredUserOrNull();
      setRegisteredUser(authUser);
    }
    if (registeredUser === undefined) {
      initializeAuthUser();
    }
  }, [registeredUser]);

  return <RegisteredUserContext.Provider value={registeredUser}>{children}</RegisteredUserContext.Provider>;
}

export const RegisteredUserContext = createContext<UserAccountOrNullOrUndefined>(undefined);

export const useRegisteredUser = (): UserAccountOrNullOrUndefined => useContext(RegisteredUserContext);
