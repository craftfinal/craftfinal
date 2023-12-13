// @/app/(authenticated)/layout.tsx

import AuthenticatedContentLayout from "@/layouts/AuthenticatedContentLayout";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { TemporaryAuthProvider } from "@/auth/temporary/TemporaryAuthProvider";

export default async function AuthenticatedRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <TemporaryAuthProvider>
      <ClerkProvider>
        <AuthenticatedContentLayout>{children}</AuthenticatedContentLayout>
        <Toaster />
      </ClerkProvider>
    </TemporaryAuthProvider>
  );
}
