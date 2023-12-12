// @/app/(authenticated)/playground/CurrentUser.server.tsx

"use server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { getCurrentUserOrNull } from "@/actions/user";
import { BellRing, Check } from "lucide-react";
import Link from "next/link";
import { siteNavigation } from "@/config/siteNavigation";

type CardProps = React.ComponentProps<typeof Card>;

export interface CurrentUserProps extends CardProps {}

export default async function CurrentUser({ className, ...props }: CurrentUserProps) {
  // Fetch current user on the server
  const currentUser = await getCurrentUserOrNull();

  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>Your account</CardTitle>
        {currentUser ? (
          <CardDescription className="text-sm font-medium leading-none">
            You are authenticated with the user account: {currentUser.firstName} {currentUser.lastName}
          </CardDescription>
        ) : (
          <CardDescription className="text-sm font-medium leading-none">
            You are exploring CraftFinal as a guest.{" "}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            {currentUser ? (
              <p className="text-sm font-medium leading-none">You may continue to use this temporary account</p>
            ) : (
              <>
                <BellRing />
                <p className="text-sm font-medium leading-none">Please allow cookies for the playground to work</p>
              </>
            )}
          </div>
          <Switch />
        </div>
      </CardContent>
      <CardFooter>
        <Link href={siteNavigation.inPlayground.href} title={siteNavigation.inPlayground.title}>
          <Button className="w-full">
            <Check className="mr-2 h-4 w-4" /> {siteNavigation.inPlayground.title}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
