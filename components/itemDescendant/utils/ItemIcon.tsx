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
export function ItemIcon(itemModel: ItemDescendantModelNameType, props: React.SVGProps<SVGSVGElement>) {
  const IconComponent = itemModelIcon[itemModel as ItemModelIconKeyType];
  return IconComponent ? <IconComponent {...props} /> : null;
}
