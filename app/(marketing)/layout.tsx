// @/app/(marketing)/layout.tsx

import ContentLayout from "../../components/layout/ContentLayout";

export default function MarketingRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ContentLayout>{children}</ContentLayout>;
}
