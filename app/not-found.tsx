import Link from "next/link";
import { PropsWithChildren } from "react";
import MainActionButton from "../components/custom/MainActionButton";
import { siteNavigation } from "@/config/navigation";
import ContentLayout from "@/layouts/ContentLayout";

interface RootNotFoundPageProps extends PropsWithChildren {}
export default function RootNotFoundPage({ children }: RootNotFoundPageProps) {
  return (
    <ContentLayout>
      {children ?? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <h1 className="text-gradient bg-gradient-to-r from-green-800 to-indigo-900 bg-clip-text pb-10 text-2xl font-bold text-transparent dark:from-blue-500 dark:to-slate-400 sm:text-3xl md:px-20 md:text-4xl">
            This page could not be found
          </h1>
          <div className="py-8">
            <Link href="/" title="Home page">
              <MainActionButton navItem={siteNavigation.home} />
            </Link>
          </div>
        </div>
      )}
    </ContentLayout>
  );
}
