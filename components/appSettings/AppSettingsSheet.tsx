// @/components/appSettings/AppSettingsSheet.tsx

"use client";

// FIXME: Somehow TypeScript has trouble importing react-markdown
// import ReactMarkdown from "react-markdown";
// import dynamic from "next/dynamic";
// const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  // SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { settingsConfig } from "@/config/settings";
import { AccountType } from "@/auth/account";
import { siteConfig } from "@/config/site";
import { Base58CheckAccountOrNullOrUndefined } from "@/types/user";
import { Settings2Icon } from "lucide-react";
import AppSettingsForm from "./AppSettingsForm";

export default function AppSettingsSheet({ account }: { account?: Base58CheckAccountOrNullOrUndefined }) {
  return !(account?.type === AccountType.Registered) ? null : (
    <Sheet>
      <SheetTrigger name="App settings toggle" aria-label="Show settings" className="flex flex-wrap items-center px-2">
        {<Settings2Icon />}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configure {siteConfig.name}</SheetTitle>
          <SheetDescription className="py-4"></SheetDescription>
        </SheetHeader>
        <AppSettingsForm />
      </SheetContent>
    </Sheet>
  );
}
