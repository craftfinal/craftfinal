"use client";

import type { User as PrismaUser } from "@prisma/client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getRegisteredUserOrNull } from "../actions/registeredUserActions";

export type RegisteredUser = PrismaUser | null | undefined;
type RegisteredAuthProviderProps = {
  children: ReactNode;
};

export function RegisteredUserProvider({ children }: RegisteredAuthProviderProps): JSX.Element {
  const [RegisteredUser, setRegisteredUser] = useState<PrismaUser | null | undefined>(undefined);

  useEffect(() => {
    async function initializeAuthUser() {
      const authUser = await getRegisteredUserOrNull();
      setRegisteredUser(authUser);
    }
    if (RegisteredUser === undefined) {
      initializeAuthUser();
    }
  }, [RegisteredUser]);

  return <RegisteredUserContext.Provider value={RegisteredUser}>{children}</RegisteredUserContext.Provider>;
}

export const RegisteredUserContext = createContext<RegisteredUser>(undefined);

export const useRegisteredUser = (): RegisteredUser => useContext(RegisteredUserContext);
