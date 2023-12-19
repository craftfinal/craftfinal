import { AuthenticatedContentLayoutChildrenProps } from "@/layouts/AuthenticatedContentLayout";

export interface NavbarProps extends AuthenticatedContentLayoutChildrenProps {
  className?: string;
}

export const menuClassName = {
  item: {
    text: "select-none leading-none no-underline outline-none transition-colors",
    container: "rounded-md px-2 lg:px-3",
  },
  topLevel: {
    text: "text-sm sm:text-base font-medium sm:leading-none lg:text-lg lg:leading-none",
    textColor: "text-muted-foreground hover:text-foreground",
    container: "min-h-[2rem] lg:min-h-[2.5rem] xl:min-h-[3rem]",
  },
  subItem: { container: "p-4 sm:p-2 md:p-3 lg:p-4" },
};
