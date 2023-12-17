import AppSettingsSheet from "@/components/appSettings/AppSettingsSheet";
import { DarkModeToggle } from "@/components/custom/DarkModeToggle";
import { cn } from "@/lib/utils";
import { hasMiddleware } from "@/middlewares/executeMiddleware";
import registeredAccountMiddleware from "@/middlewares/withRegisteredAccount";
import { NavbarProps, menuClassName } from "./Navbar";
import { SignupNavigation } from "./SignupNavigation";
import { UserProfileNavigation } from "./UserProfileNavigation";

interface NavigationActionButtonsProps extends NavbarProps {}

export default async function NavigationActionButtons({ ...props }: NavigationActionButtonsProps) {
  const registeredAuth = hasMiddleware(registeredAccountMiddleware.id);
  return (
    <div className="flex gap-4">
      <DarkModeToggle className="flex items-center" />
      <AppSettingsSheet {...props} />
      {!registeredAuth ? null : (
        <>
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
        </>
      )}
    </div>
  );
}
