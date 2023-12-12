// @/app/(marketing)/(home)/CallToAction.tsx

import { ContentLayoutChildrenProps } from "@/layouts/ContentLayout";
import EnterPlaygroundButton from "@/components/chrome/buttons/EnterPlaygroundButton";

export interface CallToActionProps extends ContentLayoutChildrenProps {}

export default async function CallToAction({ user }: CallToActionProps) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <h2 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white">
          Start your free trial today
        </h2>
        <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">
          Try CraftFinal for 30 days. No email address or credit card required
        </p>
        <EnterPlaygroundButton user={user} />
      </div>
    </div>
  );
}