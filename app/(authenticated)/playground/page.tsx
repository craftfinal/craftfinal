// @/app/(authenticated)/playground/page.tsx

import { getCurrentUserOrNull } from "@/actions/user";
import CurrentUserCard from "@/components/auth/CurrentUserCard";
import { Button } from "@/components/ui/button";
import { siteNavigation } from "@/config/navigation";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

export default async function PlaygroundPage() {
  const currentUser = await getCurrentUserOrNull();
  return (
    <div className="flex flex-col gap-y-8">
      <div className="prose">
        <h1>Playground</h1>
        <p>This is an evolving demonstration of the core features of CraftFinal.</p>
      </div>
      {!currentUser ? null : (
        <div className="flex flex-wrap gap-4">
          <CurrentUserCard user={currentUser} />
          <Link href={siteNavigation.inPlayground.href} title={siteNavigation.inPlayground.title}>
            <Button className="">
              <CheckIcon className="mr-2 h-4 w-4" /> {siteNavigation.inPlayground.title}
            </Button>
          </Link>
        </div>
      )}
      <div className="prose">
        <h2>What you will eperience</h2>
        <p>As of December 2023, you can experience the following:</p>
        <ul>
          <li>Create a new resume</li>
          <li>Add organizations, roles and achievements</li>
          <li>Edit all of these items</li>
          <li>Re-order achievements via drag and drop</li>
        </ul>
        <h2>Scope planned for January 2023</h2>
        <ul>
          <li>Complete end-to-end demonstration of the envisioned user experience at the example of a resume.</li>
        </ul>
      </div>
    </div>
  );
}
