// @/app/(marketing)/layout.tsx

import MarketingLayout from "@/layouts/MarketingLayout";

export default function MarketingRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
