// @/app/(authenticated)/layout.tsx

import { Toaster } from "@/components/ui/toaster";
import AuthenticatedContentLayout from "@/layouts/AuthenticatedContentLayout";
import React from "react";

export default async function AuthenticatedRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthenticatedContentLayout>{children}</AuthenticatedContentLayout>
      <Toaster />
    </>
  );
}
