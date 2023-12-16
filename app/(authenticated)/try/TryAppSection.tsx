// @/app/(marketing)/(home)/WelcomeMessage.tsx

import { getCurrentAccountOrNull } from "@/actions/user";
import TryAppButton from "@/components/chrome/buttons/TryAppButton";
import { siteConfig } from "@/config/site";
import { AuthenticatedContentLayoutChildrenProps } from "@/layouts/AuthenticatedContentLayout";

export interface TryAppSectionProps extends AuthenticatedContentLayoutChildrenProps {}

export default async function TryAppSection({ account: account }: TryAppSectionProps) {
  const currentAccount = account ?? (await getCurrentAccountOrNull());

  return (
    <section className="from gray-00 spacey-10 bg-gradient-to-r to-gray-200 py-10 md:py-20">
      <div className="mx-auto text-center">
        <div
          className="text-gradient flex justify-center bg-gradient-to-r from-green-800 to-indigo-900
        bg-clip-text
        pb-10
        text-6xl font-bold
        text-transparent dark:from-blue-500
        dark:to-slate-400
        md:px-20"
        >
          {siteConfig.description}
        </div>

        <p
          className="md-10 bg-gradient-to-r from-black
        to-gray-400
        bg-clip-text text-lg
        font-bold text-transparent
        dark:from-white
        dark:to-gray-300
        md:text-xl"
        >
          Create and revise resumes in the playground
        </p>
        <div className="flex justify-center gap-4 pt-10">
          <TryAppButton account={currentAccount}></TryAppButton>
        </div>
      </div>
    </section>
  );
}
