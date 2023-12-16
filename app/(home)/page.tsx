// @/app/(marketing)/page.tsx

import { cn } from "@/lib/utils";
import CallToAction from "./CallToAction";
import DesignedForYou from "./DesignedForYou";
import HeroSection from "./HeroSection";
import SocialProof from "./SocialProof";
import SolidFoundation from "./SolidFoundation";
import DistinguishingFeatures from "./DistinguishingFeatures";

export default async function HomePage() {
  // Note: If we were to call `getCurrentUserOrNull()` here, we would need to change the role
  // of this route to not be ignored but instead be public in `ClerkAuth`
  const currentAcount = null;
  const sections = [
    { id: "hero", cmp: <HeroSection account={currentAcount} /> },
    { id: "SocialProof", cmp: <SocialProof />, disabled: true },
    { id: "DesignedForYou", cmp: <DesignedForYou /> },
    { id: "DistinguishingFeatures", cmp: <DistinguishingFeatures /> },
    { id: "SolidFoundation", cmp: <SolidFoundation />, disabled: true },
    { id: "CallToAction", cmp: <CallToAction account={currentAcount} /> },
  ];
  return (
    <>
      {sections
        .filter((sect) => !sect?.disabled)
        .map((sect, index) => {
          return (
            <section
              key={sect.id}
              id={sect.id}
              className={cn("container", {
                "": index % 2 === 0,
                "bg-background/40 dark:bg-background/40": index % 2 === 1,
              })}
            >
              {sect.cmp}
            </section>
          );
        })}
    </>
  );
}
