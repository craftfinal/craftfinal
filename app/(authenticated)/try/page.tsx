// @/app/(authenticated)/try/page.tsx

import { getCurrentAccountOrNull } from "@/actions/user";
import TryAppSection from "./TryAppSection";

export default async function TryAppPage() {
  const currentAccount = await getCurrentAccountOrNull();

  return <TryAppSection account={currentAccount} />;
}
