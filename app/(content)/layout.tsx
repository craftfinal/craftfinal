// @/app/(content)/layout.tsx

import ContentLayout from "@/layouts/ContentLayout";

export default function ContentRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ContentLayout>{children}</ContentLayout>;
}
