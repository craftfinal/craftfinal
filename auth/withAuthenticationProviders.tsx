// @/auth/withAuthenticationProviders.tsx

import { getCurrentUserOrNull } from "@/actions/user";
import { RegisteredUserProvider } from "@/auth/RegisteredUserProvider";
import React from "react";
import { TemporaryUserProvider } from "./TemporaryUserProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withAuthenticationProviders = (Component: React.ComponentType<any>) => {
  const currentUser = getCurrentUserOrNull();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function WithAuthenticationProviders(props: any) {
    return (
      <RegisteredUserProvider>
        <TemporaryUserProvider>
          <Component user={currentUser} {...props} />
        </TemporaryUserProvider>
      </RegisteredUserProvider>
    );
  };
};

export default withAuthenticationProviders;
