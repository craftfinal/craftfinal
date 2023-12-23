// @/components/itemDescendant/ItemDescendantItem.tsx

import { useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { useStoreName } from "@/contexts/StoreNameContext";
import { cn } from "@/lib/utils";
import { DateTimeFormat, DateTimeSeparator, dateToISOLocal } from "@/lib/utils/formatDate";
import {
  getItemSchema,
  getSchemaFields,
  getUpdateFromEdiTextField,
  getUpdateFromEvent,
} from "@/lib/utils/itemDescendantListUtils";
import { ItemClientStateType } from "@/schemas/item";
import useAppSettingsStore from "@/stores/appSettings/useAppSettingsStore";
import { ItemDisposition } from "@/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { InputProps } from "react-editext";
import { useForm } from "react-hook-form";
import { ItemDescendantRenderProps } from "./ItemDescendantList.client";
import EditableField from "./utils/EditableField";
import { ItemIcon } from "./utils/ItemIcon";

export interface ItemProps extends ItemDescendantRenderProps {}
export default function Item(props: ItemProps) {
  const settingsStore = useAppSettingsStore();
  const { showItemDescendantInternals } = settingsStore.itemDescendant;
  const showListItemInternals = process.env.NODE_ENV === "development" && showItemDescendantInternals;

  return (
    <div className={cn("gap-y-2lg:gap-3 flex flex-1 items-center justify-between xl:gap-4", props.className)}>
      <div className="flex flex-1 items-center gap-1 lg:gap-2 xl:gap-3">
        <ItemHeader {...props} />
      </div>
      {showListItemInternals && <ListItemInternals {...props} />}
    </div>
  );
}

function ItemHeader(props: ItemProps) {
  const { itemModel, item, resumeAction } = props;
  // const [editingInput, setEditingInput] = useState(resumeAction === "edit");
  const descendantModel = item.descendantModel;
  const numDescendants = item.descendants.filter((descendant) => !descendant.deletedAt).length;

  const storeName = useStoreName();
  const store = useItemDescendantStore(storeName);
  const setItemData = store((state) => state.setItemData);
  const markItemAsDeleted = store((state) => state.markItemAsDeleted);

  const canEdit = itemModel === "user" ? false : resumeAction === "edit";

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
      setItemData(update);
      // Update form state
      updateValidationStatus();
    }
  };

  const handleSave = (value?: string, inputProps?: InputProps) => {
    // const update = handleUpdatedKeyValue(getUpdatedKeyValueFromEdiTextField(value, inputProps));
    const update = getUpdateFromEdiTextField(itemFormSchema, value, inputProps);
    if (update) {
      // Update the Zustand store
      setItemData(update);
      // Update form state
      updateValidationStatus();
    }
  };

  return (
    <div
      className={cn("flex flex-1 items-center gap-1 lg:gap-2 xl:gap-3", {
        // "bg-background/50 text-muted-foreground bg-blend-soft-light": item.disposition !== ItemDisposition.Synced,
        "text-muted-foreground": item.disposition !== ItemDisposition.Synced,
        "outline-red-500": !inputIsValid,
        "outline-none": inputIsValid,
      })}
    >
      {canEdit && ItemIcon(itemModel)}
      {itemModel === "user" ? (
        <div className="py-4 text-lg font-medium xl:text-xl">
          You{" "}
          {numDescendants === 0
            ? `don‘t have any ${descendantModel}s yet`
            : `have ${numDescendants === 1 ? `one ${descendantModel}` : `${numDescendants} ${descendantModel}s`}`}
        </div>
      ) : (
        itemFormFields.map((field) => (
          <div
            key={field}
            className="text-shadow-dark dark:text-light-txt-1 text-dark-txt-1 dark:text-light-txt-4 flex-1"
          >
            <EditableField
              key={field}
              fieldName={field}
              value={item[field as keyof ItemClientStateType] as string}
              placeholder={`${field} for ${itemModel}`}
              onChange={handleChange}
              onSave={handleSave}
              canEdit={canEdit}
            />
          </div>
        ))
      )}
      {canEdit && (
        <button
          /* /Delete Button */
          className="text-light-txt-2 dark:text-light-txt-1 self-stretch px-4 opacity-100 transition-all duration-150 md:group-hover:opacity-100"
          title={`Delete ${itemModel}`}
          onClick={() => markItemAsDeleted()}
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
      )}
    </div>
  );
}

export function ListItemInternals(props: ItemProps) {
  const { index, item } = props;
  return (
    <div className="flex cursor-auto items-center gap-x-4 px-4 py-2 text-xs text-slate-600">
      <p className="flex h-full items-center bg-slate-200 px-2 text-lg">{index}</p>
      <table>
        <tbody>
          <tr>
            <td
              className={cn("py-0", {
                "text-red-500": item.disposition !== ItemDisposition.Synced,
              })}
            >
              {item.disposition}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="w-auto">
        <tbody>
          <tr>
            <td
              className={cn("py-0", {
                "text-red-500": item.disposition !== ItemDisposition.Synced,
              })}
            >
              <span className="text-xs text-muted-foreground">modified</span>:&nbsp;
              <span className="py-0">
                {dateToISOLocal(item.lastModified, DateTimeFormat.MonthDayTime, DateTimeSeparator.Newline)}
              </span>
            </td>
          </tr>
          <tr>
            <td className={"py-0"}>
              <span className="text-xs text-muted-foreground">created</span>:&nbsp;
              {dateToISOLocal(item.createdAt, DateTimeFormat.MonthDayTime, DateTimeSeparator.Newline)}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="w-auto">
        <tbody>
          <tr>
            <td className="py-0">
              <span className="text-xs text-muted-foreground">client</span>&nbsp;
              <code>{item.clientId?.substring(0, 8)}&hellip;</code>
            </td>
          </tr>
          <tr>
            <td className="py-0">
              <span className="text-xs text-muted-foreground">server</span>&nbsp;
              <code>{item.id?.substring(0, 8)}&hellip;</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
