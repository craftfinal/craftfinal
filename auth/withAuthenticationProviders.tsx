// @/auth/withAuthenticationProviders.tsx

import { getCurrentAccountOrNull } from "@/actions/user";
// import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
// import { RegisteredAccountProvider } from "./RegisteredAccountProvider";
import { TemporaryAccountProvider } from "./TemporaryAccountProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withAuthenticationProviders = (Component: React.ComponentType<any>) => {
  const currentAcount = getCurrentAccountOrNull();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function WithAuthenticationProviders(props: any) {
    return (
      // <ClerkProvider>
      // <RegisteredAccountProvider>
      <TemporaryAccountProvider>
        <Component account={currentAcount} {...props} />
      </TemporaryAccountProvider>
      // </RegisteredAccountProvider>
      // </ClerkProvider>
    );
  };
};

export default withAuthenticationProviders;
