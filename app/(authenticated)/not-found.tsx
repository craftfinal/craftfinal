import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import UserActionButton from "../../components/custom/UserActionButton";

export default function AuthenticatedNotFoundPage({ children }: { children?: ReactNode | ReactNode[] }) {
  notFound();
  return (
    <>
      {children ?? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <h1 className="text-gradient bg-gradient-to-r from-green-800 to-indigo-900 bg-clip-text pb-10 text-3xl font-bold text-transparent dark:from-blue-500 dark:to-slate-400 sm:text-4xl md:px-20 md:text-6xl">
            This page could not be found
          </h1>
          <div className="py-8">
            <Link href="javascript:histor(-1)" title="Back to previous page">
              <UserActionButton>Back to previous page</UserActionButton>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
