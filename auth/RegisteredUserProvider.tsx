// @/auth/temporary/RegisteredUserProvider.tsx

"use client";

import { getRegisteredUserOrNull } from "@/actions/registeredUserActions";
import { UserAccountOrNullOrUndefined } from "@/types/user";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type RegisteredUserProviderProps = {
  children: ReactNode;
};
export function RegisteredUserProvider({ children }: RegisteredUserProviderProps): JSX.Element {
  const [registeredUser, setRegisteredUser] = useState<UserAccountOrNullOrUndefined>(undefined);
  useEffect(() => {
    if (registeredUser === undefined) {
      const initializeRegisteredUser = async () => {
        // Fetch current user by calling a server action
        const user = await getRegisteredUserOrNull();
        setRegisteredUser(user);
      };
      initializeRegisteredUser();
    }
  }, []); // Empty dependency array to run only once after component mounts

  return <RegisteredUserContext.Provider value={registeredUser}>{children}</RegisteredUserContext.Provider>;
}

export const RegisteredUserContext = createContext<UserAccountOrNullOrUndefined>(undefined);

export const useRegisteredUser = (): UserAccountOrNullOrUndefined => useContext(RegisteredUserContext);
