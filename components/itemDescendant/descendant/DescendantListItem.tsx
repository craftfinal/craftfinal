// @/component/itemDescendant/ItemDescendantListItem.tsx

import { cn } from "@/lib/utils";
import {
  getInputProps,
  getItemSchema,
  getSchemaFields,
  getUpdateFromEdiTextField,
  getUpdateFromEvent,
} from "@/lib/utils/itemDescendantListUtils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";

import { ItemClientStateType, ItemDataUntypedType } from "@/schemas/item";
import useAppSettingsStore from "@/stores/appSettings/useAppSettingsStore";
import { ClientIdType, ItemDisposition } from "@/types/item";
import { ItemDescendantModelNameType, itemDescendantModelHierarchy } from "@/types/itemDescendant";
import { Slot } from "@radix-ui/react-slot";
import { Grip } from "lucide-react";
import { ElementType, ReactNode, useState } from "react";
import { InputProps } from "react-editext";
import { ItemDescendantRenderProps } from "../ItemDescendantList.client";
import { RenderItemProps } from "../RenderItem";
import { ListItemInternals } from "../devel/ListItemInternals";
import { ResumeItemCard } from "../models/resume/ResumeItemCard";
import EditableField from "../utils/EditableField";
import { ItemActionButton } from "../utils/ItemActionButton";
import { ItemIcon } from "../utils/ItemIcon";

export type RenderItemComponentType = (props: RenderItemProps<ItemClientStateType>) => ReactNode;
export const ItemComponent: Record<ItemDescendantModelNameType, RenderItemComponentType | null> = {
  user: null,
  resume: ResumeItemCard as RenderItemComponentType,
  organization: null,
  role: null,
  achievement: null,
};

// export interface DescendantListItemProps extends ItemDescendantRenderProps {
//   as: string;
//   setItemData: (data: ItemDataUntypedType, clientId: string) => void;
//   markItemAsDeleted: (clientId: ClientIdType) => void;
//   itemIsDragable: boolean;
//   canEdit: boolean;
// }

// By default, DescendantListItem renders as an li element.
// When `as` is passed as an argument, it renders as the provided HTML element
// When `asChild` is true, it renders using the Slot component, adapting to the parent's component structure and styles.

export interface DescendantListItemProps extends ItemDescendantRenderProps {
  setItemData: (data: ItemDataUntypedType, clientId: string) => void;
  markItemAsDeleted: (clientId: ClientIdType) => void;
  itemIsDragable: boolean;
  canEdit: boolean;
}

// Define a type that conditionally checks if T is a string (like 'div', 'span', etc.)
// and uses JSX.IntrinsicElements[T] to get the correct prop types.
type ElementProps<T extends ElementType> = T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : T;

export type DescendantListItemElementProps<T extends ElementType> = {
  as?: T;
  asChild?: boolean;
} & ElementProps<T> &
  DescendantListItemProps;
// export default function DescendantListItem({
export default function DescendantListItem<T extends ElementType = "li">(props: DescendantListItemElementProps<T>) {
  const { as, asChild = false, resumeAction = "view", itemModel, item, setItemData, itemIsDragable, canEdit } = props;

  const Comp = asChild ? Slot : as || "li";

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.clientId,
  });
  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Construct the URL to edit this item
  const pathname = usePathname();

  const settingsStore = useAppSettingsStore();
  const { showItemDescendantInternals } = settingsStore.itemDescendant;

  const itemFormSchema = getItemSchema(itemModel, "form");
  const itemFormFields = getSchemaFields(itemModel, "display");
  const {
    // register,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemFormSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputIsValid, setInputIsValid] = useState(true);

  if (item.deletedAt)
    throw Error(
      `DescendantListItem: called with deleted item: deletedAt=${item.deletedAt}` + "\n" + JSON.stringify(item),
    );

  const updateValidationStatus = () => {
    const validationStatus = itemFormSchema.safeParse({ ...item });
    setInputIsValid(validationStatus.success);
    return validationStatus;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    // const update = handleUpdatedKeyValue(getUpdatedKeyValueFromEvent(event));
    const update = getUpdateFromEvent(itemFormSchema, event);
    if (update) {
      // Update the Zustand store
      setItemData(update, item.clientId);
      // Update form state
      updateValidationStatus();
    }
  };

  const handleSave = (value?: string, inputProps?: InputProps) => {
    // const update = handleUpdatedKeyValue(getUpdatedKeyValueFromEdiTextField(value, inputProps));
    const update = getUpdateFromEdiTextField(itemFormSchema, value, inputProps);
    if (update) {
      // Update the Zustand store
      setItemData(update, item.clientId);
      // Update form state
      updateValidationStatus();
    }
  };

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const handleSave = (val: any, inputProps?: InputProps) => {
  //   if (inputProps?.name) {
  //     setItemData({ [inputProps.name]: val } as ItemDataUntypedType, item.clientId);
  //   } else {
  //     window.consoleLog(
  //       `ItemDescendantListItem: missing field name in handleSave(value=`,
  //       val,
  //       `, inputProps=`,
  //       inputProps,
  //       `)`,
  //     );
  //   }
  // };

  let content = null;
  const CustomComponent = ItemComponent[itemModel];
  if (CustomComponent !== null) {
    content = <CustomComponent {...{ item, index: 0, itemModel, resumeAction }} />;
  } else {
    content = (
      <Comp
        key={item.clientId}
        className={cn(
          "border-shadow-light dark:border-dark-txt-1 bg-elem-light dark:bg-elem-dark-1 group flex flex-1 cursor-auto items-center justify-between rounded-md",
          {
            // "bg-background/50 text-muted-foreground bg-blend-soft-light": item.disposition !== ItemDisposition.Synced,
            "text-muted-foreground": item.disposition !== ItemDisposition.Synced,
            "outline-red-500": !inputIsValid,
            "outline-none": inputIsValid,
            "basis-1/4": showItemDescendantInternals,
          },
        )}
        ref={setNodeRef}
        style={styles}
        {...attributes}
      >
        <>
          {itemModel == itemDescendantModelHierarchy[1] || !canEdit ? null : ItemIcon(itemModel)}

          {item.id && (itemModel === "resume" || pathname.startsWith("/item")) ? (
            <ItemActionButton pathname={pathname} item={item} action={resumeAction} />
          ) : null}
          {canEdit && itemIsDragable ? (
            <div
              className={cn("flex h-full items-center", {
                "hover:cursor-grab active:cursor-grabbing": itemIsDragable,
              })}
              {...listeners}
            >
              <Grip className="mr-2 lg:mr-4" />
            </div>
          ) : null}
          <div className="flex flex-1 flex-wrap justify-between gap-y-2">
            {itemFormFields.map((fieldName) => {
              const inputProps = getInputProps(item, itemModel, fieldName);

              return (
                <div
                  key={fieldName}
                  className="text-shadow-dark dark:text-light-txt-1 text-dark-txt-1 dark:text-light-txt-4 flex-1"
                >
                  <EditableField
                    key={inputProps.key}
                    fieldName={inputProps.name}
                    value={item[fieldName as keyof ItemClientStateType] as string}
                    placeholder={inputProps.placeholder}
                    onChange={handleChange}
                    onSave={handleSave}
                    canEdit={canEdit}
                  />
                </div>
              );
            })}
            {/* TODO: Handle and display errors from formState.errors */}
          </div>
          <ListItemDeleteButton {...props} />
          {showItemDescendantInternals && <ListItemInternals {...props} />}
        </>
      </Comp>
    );
  }
  return asChild ? <Comp>{content}</Comp> : content;
}

export function ListItemDeleteButton(props: DescendantListItemProps) {
  const { itemModel, item, markItemAsDeleted, canEdit } = props;
  return canEdit && itemModel !== "user" ? (
    <button
      /* /Delete Button */
      className="text-light-txt-2 dark:text-light-txt-1 self-stretch px-4 opacity-100 transition-all duration-150 md:group-hover:opacity-100"
      title={`Delete ${itemModel}`}
      onClick={() => markItemAsDeleted(item.clientId)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  ) : null;
}
