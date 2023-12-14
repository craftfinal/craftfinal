import AppSettingsSheet from "@/components/appSettings/AppSettingsSheet";
import { DarkModeToggle } from "@/components/custom/DarkModeToggle";
import { NavbarProps, menuClassName } from "./Navbar";
import { SignupNavigation } from "./SignupNavigation";
import { UserProfileNavigation } from "./UserProfileNavigation";
import { cn } from "@/lib/utils";

interface NavigationActionButtonsProps extends NavbarProps {}

export default async function NavigationActionButtons({ ...props }: NavigationActionButtonsProps) {
  return (
    <div className="flex gap-4">
      <DarkModeToggle className="flex items-center" />
      <SignupNavigation
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
      {!props.user ? null : (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-4">
          <AppSettingsSheet />
        </div>
      )}
      <UserProfileNavigation
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
