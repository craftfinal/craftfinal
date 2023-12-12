// @/app/(marketing)/layout.tsx

import MainLayout from "../../layouts/MainLayout";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <MainLayout>{children}</MainLayout>;
}
