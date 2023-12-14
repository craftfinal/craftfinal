import AppSettingsSheet from "@/components/appSettings/AppSettingsSheet";
import { DarkModeToggle } from "@/components/custom/DarkModeToggle";
import { NavbarProps, menuClassName } from "./Navbar";
import { SignupNavigation } from "./SignupNavigation";
import { UserProfileNavigation } from "./UserProfileNavigation";
import { cn } from "@/lib/utils";
import { getCurrentUserOrNull } from "@/actions/user";

interface NavigationActionButtonsProps extends NavbarProps {}

export default async function NavigationActionButtons({ user, ...props }: NavigationActionButtonsProps) {
  const currentUser = user ?? (await getCurrentUserOrNull());
  return (
    <div className="flex gap-4">
      <DarkModeToggle className="flex items-center" />
      <SignupNavigation
        user={currentUser}
        {...props}
        className={cn(
          menuClassName.item.container,
          menuClassName.item.text,
          menuClassName.topLevel.text,
          // menuClassName.topLevel.textColor,
          menuClassName.topLevel.container,
          "flex items-center",
        )}
      />
      {!currentUser ? null : (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-4">
          <AppSettingsSheet />
        </div>
      )}
      <UserProfileNavigation
        user={currentUser}
        {...props}
        className={cn(
          menuClassName.item.container,
          menuClassName.item.text,
          menuClassName.topLevel.text,
          // menuClassName.topLevel.textColor,
          menuClassName.topLevel.container,
          "flex items-center",
        )}
      />
    </div>
  );
}
