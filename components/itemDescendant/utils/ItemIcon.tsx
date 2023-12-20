import { cn } from "@/lib/utils";
import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { DotIcon } from "lucide-react";
import { GrUserManager } from "react-icons/gr";
import { HiOutlineDocumentText } from "react-icons/hi";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";

export const itemModelIcon = {
  resume: HiOutlineDocumentText,
  organization: HiOutlineBuildingLibrary,
  role: GrUserManager,
  achievement: DotIcon,
};
export type ItemModelIconKeyType = keyof typeof itemModelIcon;
export function ItemIcon(itemModel: ItemDescendantModelNameType, props?: React.SVGProps<SVGSVGElement>) {
  const IconComponent = itemModelIcon[itemModel as ItemModelIconKeyType];
  const iconProps = { ...props, className: cn("w-auto shrink-0 h-6 xl:h-8 pl-4 pr-2", props?.className) };
  return IconComponent ? <IconComponent {...iconProps} /> : null;
}
