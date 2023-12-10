// @/app/(marketing)/layout.tsx

import MarketingLayout from "../../components/layout/MarketingLayout";

export default function MarketingRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
