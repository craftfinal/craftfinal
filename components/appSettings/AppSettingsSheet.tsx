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
import { UserAccountOrNullOrUndefined } from "@/types/user";
import { Settings2Icon } from "lucide-react";
import AppSettingsForm from "./AppSettingsForm";

export default function AppSettingsSheet({ user }: { user?: UserAccountOrNullOrUndefined }) {
  return !(user?.account.type === AccountType.Registered) ? null : (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-4">
      <Sheet>
        <SheetTrigger name="App settings toggle" aria-label="Show settings">
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
    </div>
  );
}
