// @/app/(content)/layout.tsx

import ContentLayout from "@/components/layout/ContentLayout";

export default function ContentRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ContentLayout>{children}</ContentLayout>;
}
