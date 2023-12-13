// @/app/(authenticated)/layout.tsx

import AuthenticatedContentLayout from "@/layouts/AuthenticatedContentLayout";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { TemporaryUserProvider } from "@/auth/TemporaryUserProvider";

export default async function AuthenticatedRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <TemporaryUserProvider>
      <ClerkProvider>
        <AuthenticatedContentLayout>{children}</AuthenticatedContentLayout>
        <Toaster />
      </ClerkProvider>
    </TemporaryUserProvider>
  );
}
