// @/app/(authenticated)/try/page.tsx

import { getCurrentUserOrNull } from "@/actions/user";
import TryAppSection from "./TryAppSection";

export default async function TryAppPage() {
  return <TryAppSection user={await getCurrentUserOrNull()} />;
}
