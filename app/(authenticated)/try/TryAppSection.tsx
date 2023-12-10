// @/app/(marketing)/(home)/WelcomeMessage.tsx

import { getCurrentUserOrNull } from "@/actions/user";
import { AuthenticatedContentLayoutChildrenProps } from "@/app/(authenticated)/AuthenticatedContentLayout";
import TryAppButton from "@/components/layout/buttons/TryAppButton";
import { siteConfig } from "@/config/site";

export interface TryAppSectionProps extends AuthenticatedContentLayoutChildrenProps {}

export default async function TryAppSection({ user }: TryAppSectionProps) {
  const currentUser = user ?? (await getCurrentUserOrNull());

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
          Import your resume and tailor it with AI to get the job of your dreams!
        </p>
        <div className="flex justify-center gap-4 pt-10">
          <TryAppButton user={currentUser}></TryAppButton>
        </div>
      </div>
    </section>
  );
}
