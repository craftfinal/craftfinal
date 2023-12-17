// @/app/(marketing)/(home)/EnterActionButton.tsx

import { ActionButton } from "@/components/custom/ActionButton";
import { NavItem } from "@/types";
import Link from "next/link";

interface MainActionButtonProps {
  navItem: NavItem;
  prefetch?: boolean;
}

export default function MainActionButton({ navItem, prefetch }: Readonly<MainActionButtonProps>) {
  const navPrefetch = prefetch !== undefined ? prefetch : !navItem.authenticated;
  return (
    <Link href={navItem.href} title={navItem.title} prefetch={navPrefetch}>
      <ActionButton
        name={navItem.menuTitle ?? navItem.title}
        variant="default"
        className="bg-gradient-to-r from-green-800
    to-indigo-900
    p-5 text-lg text-background hover:from-green-600
    hover:to-indigo-700 dark:from-blue-200 dark:to-slate-300 hover:dark:from-blue-300
    hover:dark:to-slate-400 dark:hover:text-foreground md:p-8 md:text-3xl
    "
      >
        {navItem.title}
      </ActionButton>
    </Link>
  );
}
