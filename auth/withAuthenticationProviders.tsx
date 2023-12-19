// @/auth/withAuthenticationProviders.tsx

import { getCurrentAccountOrNull } from "@/actions/user";
// import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
// import { RegisteredAccountProvider } from "./RegisteredAccountProvider";
// import { TemporaryAccountProvider } from "./temporary-account/TemporaryAccountProvider";
import { IronSessionProvider } from "./iron-session/IronSessionProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withAuthenticationProviders = (Component: React.ComponentType<any>) => {
  const currentAcount = getCurrentAccountOrNull();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function WithAuthenticationProviders(props: any) {
    return (
      // <ClerkProvider>
      // <RegisteredAccountProvider>
      // <TemporaryAccountProvider>
      <IronSessionProvider>
        <Component account={currentAcount} {...props} />
      </IronSessionProvider>
      // </TemporaryAccountProvider>
      // </RegisteredAccountProvider>
      // </ClerkProvider>
    );
  };
};

export default withAuthenticationProviders;
