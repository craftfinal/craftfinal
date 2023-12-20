// @/components/itemDescendant/ItemDescendantListItemInput.tsx

import { cn } from "@/lib/utils";
import {
  extractFieldName,
  getInitialItemDraftState,
  getInputProps,
  getItemSchema,
  getSchemaFields,
  isNumberField,
} from "@/lib/utils/itemDescendantListUtils";
import { ItemDataUntypedType } from "@/schemas/item";
import useAppSettingsStore from "@/stores/appSettings/useAppSettingsStore";
import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { CheckCircleIcon } from "lucide-react";
import { /*Dispatch, SetStateAction, */ useEffect, useState } from "react";
import { InputProps } from "react-editext";
import { SafeParseReturnType, z } from "zod";
import { Button } from "../../ui/button";
import { toast } from "../../ui/use-toast";
import EditableInputField from "../utils/EditableInputField";

interface DescendantListItemInputProps {
  itemModel: ItemDescendantModelNameType;
  itemDraft: ItemDataUntypedType;
  updateItemDraft: (itemData: ItemDataUntypedType) => void;
  commitItemDraft: () => void;
  canEdit: boolean;
  editingInput: boolean;
  // setEditingInput: Dispatch<SetStateAction<boolean>>;
}
export default function DescendantListItemInput({
  canEdit,
  editingInput /* setEditingInput, */,
  itemModel,
  itemDraft,
  updateItemDraft,
  commitItemDraft,
}: Readonly<DescendantListItemInputProps>) {
  const itemFormSchema = getItemSchema(itemModel, "form");
  const itemFormFields = getSchemaFields(itemModel, "display");

  type ItemDataType = z.output<typeof itemFormSchema>;
  type ItemDataFieldNameType = keyof ItemDataType;
  type ItemDataFieldValueType = string | number;

  const [draftValidationStatus, setDraftValidationStatus] = useState<
    SafeParseReturnType<ItemDataUntypedType, ItemDataUntypedType>
  >({} as SafeParseReturnType<ItemDataUntypedType, ItemDataUntypedType>);

  const settingsStore = useAppSettingsStore();
  const { showItemDescendantInternals } = settingsStore;
  const showListItemInternals = process.env.NODE_ENV === "development" && showItemDescendantInternals;

  // Initialize local state for field values
  const [itemDraftState, setItemDraftState] = useState(getInitialItemDraftState(itemDraft, itemFormFields));

  // Updadte validationStatus once when component mounts
  useEffect(() => {
    validate(itemDraft);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (newDraftState: ItemDataUntypedType) => {
    const validationStatus = itemFormSchema.safeParse(newDraftState);
    setDraftValidationStatus(validationStatus);
  };

  const updateItemDraftAndState = (fieldName: ItemDataFieldNameType, newValue: ItemDataFieldValueType) => {
    const newDraftState = { ...itemDraft, [fieldName]: newValue };
    // Update the local state
    // setItemDraftState((prev) => ({ ...prev, [fieldName]: newValue }));
    setItemDraftState(newDraftState);
    // Update the Zustand store
    // NOTE: Taking the `itemDraftState` does not work as it will only change on the next render
    // updateItemDraft({ ...itemDraftState });
    updateItemDraft({ ...newDraftState });
    // Update validation status after changing the draft
    validate(newDraftState);
  };

  // Reset field values after commit
  const resetItemDraftAndState = (initialValue: string | null | undefined = "") => {
    const initialDraftState = itemFormFields.reduce((acc, field) => ({ ...acc, [field]: initialValue }), {});
    // Update the local state
    setItemDraftState(initialDraftState);
    // Update the Zustand store
    // updateItemDraft({ ...itemDraft, [fieldName]: newValue });
    // updateItemDraft({ ...itemDraftState, [fieldName]: newValue });
    updateItemDraft({ ...initialDraftState });
    // Update validation status after changing the draft
    validate(initialDraftState);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (event.target.name) {
      const fieldName = extractFieldName(event.target.name);
      let newValue: ItemDataFieldValueType = event.target.value;
      // Check if the field is a number and parse it
      if (isNumberField(itemFormSchema, fieldName)) {
        newValue = parseFloat(newValue) || 0; // Default to 0 if parsing fails
      }
      updateItemDraftAndState(fieldName, newValue);
    }
  };

  const handleSave = (value?: string, inputProps?: InputProps) => {
    if (value && inputProps?.name) {
      // Update the item draft in the store
      const fieldName = extractFieldName(inputProps.name);

      let newValue: ItemDataFieldValueType = value;

      // Check if the field is a number and parse it
      if (isNumberField(itemFormSchema, fieldName)) {
        newValue = parseFloat(newValue) || 0; // Default to 0 if parsing fails
      }
      updateItemDraftAndState(fieldName, newValue);
    }
    return commitToStore();
  };

  const commitToStore = () => {
    // Perform validation before committing
    validate(itemDraft);
    if (draftValidationStatus.success) {
      commitItemDraft();
      // Reset field values after commit
      resetItemDraftAndState();
    } else {
      window.consoleLog(
        `handleSubmit: Validation failed. itemDraft:`,
        itemDraft,
        `draftValidationStatus:`,
        draftValidationStatus,
      );
      toast({ title: `Validation failed`, description: JSON.stringify(draftValidationStatus) });
    }
  };

  const handleSubmitButton = () => {
    commitToStore();
  };

  // const handleFocus = (event: React.MouseEvent<HTMLDivElement>) => {
  //   window.consoleLog(`handleFocus: setEditingInput from ${editingInput} -> true with event[${typeof event}]:`, event);
  //   setEditingInput(true);
  // };

  // const handleBlur = (event: React.MouseEvent<HTMLDivElement>) => {
  //   window.consoleLog(`handleFocus: setEditingInput from ${editingInput} -> false with event[${typeof event}]:`, event);
  //   setEditingInput(false);
  // };

  return (
    <div className="flex flex-grow items-center">
      <div className="flex flex-grow flex-wrap justify-between gap-x-4 gap-y-2">
        {itemFormFields.map((fieldName) => {
          const inputProps = getInputProps(itemDraftState, itemModel, fieldName);
          return (
            <EditableInputField
              key={inputProps.key}
              fieldName={inputProps.fieldName}
              value={inputProps.value}
              placeholder={inputProps.placeholder}
              onChange={handleChange}
              onSave={handleSave}
              editing={editingInput}
              canEdit={canEdit}
              className="flex flex-1 gap-x-4 gap-y-2"
            />
          );
        })}
      </div>
      <Button
        variant="ghost"
        disabled={!draftValidationStatus.success}
        onClick={handleSubmitButton}
        title={`Create ${itemModel}`}
      >
        {<CheckCircleIcon />}
      </Button>
      {showListItemInternals && (
        <div className={cn("my-2 p-2 text-xs")}>
          <pre>{JSON.stringify(itemDraft, undefined, 2)}</pre>
        </div>
      )}
    </div>
  );
}
