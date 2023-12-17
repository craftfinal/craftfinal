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
import { Plus } from "lucide-react";
import { /*Dispatch, SetStateAction, */ useState } from "react";
import { InputProps } from "react-editext";
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

  const [inputIsValid, setInputIsValid] = useState(false);

  const settingsStore = useAppSettingsStore();
  const { showItemDescendantInternals } = settingsStore;
  const showListItemInternals = process.env.NODE_ENV === "development" && showItemDescendantInternals;

  // Initialize local state for field values
  const [itemDraftState, setItemDraftState] = useState(getInitialItemDraftState(itemDraft, itemFormFields));

  const validate = (itemDraft: object) => {
    const validationStatus = itemFormSchema.safeParse({ ...itemDraft });
    return validationStatus;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.name) {
      const fieldName = extractFieldName(event.target.name);
      let newValue: string | number = event.target.value;
      // Check if the field is a number and parse it
      if (isNumberField(itemFormSchema, fieldName)) {
        newValue = parseFloat(newValue) || 0; // Default to 0 if parsing fails
      }

      setItemDraftState((prev) => ({ ...prev, [fieldName]: newValue }));
      updateItemDraft({ ...itemDraft, [fieldName]: newValue });
    }

    const validationStatus = validate({ ...itemDraft });
    setInputIsValid(validationStatus.success);
  };

  const handleSave = (value?: string, inputProps?: InputProps) => {
    if (value && inputProps?.name) {
      // Update the item draft in the store
      const fieldName = extractFieldName(inputProps.name);

      let newValue: string | number = value;

      // Check if the field is a number and parse it
      if (isNumberField(itemFormSchema, fieldName)) {
        newValue = parseFloat(newValue) || 0; // Default to 0 if parsing fails
      }

      // Update the local state
      setItemDraftState((prev) => ({ ...prev, [fieldName]: newValue }));
      // Update the Zustand store
      updateItemDraft({ ...itemDraftState, [fieldName]: newValue });
    }
    return commitToStore();
  };

  const commitToStore = (): boolean => {
    // Perform validation before committing
    const validationStatus = validate({ ...itemDraft });
    setInputIsValid(validationStatus.success);
    if (validationStatus.success) {
      commitItemDraft();
      // Reset field values after commit
      setItemDraftState(itemFormFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {}));
      setInputIsValid(false);
    } else {
      window.consoleLog(
        `handleSubmit: Validation failed. itemDraft:`,
        itemDraft,
        `validationStatus:`,
        validationStatus,
      );
      toast({ title: `Validation failed`, description: JSON.stringify(validationStatus) });
    }
    return validationStatus.success;
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
      <Button variant="ghost" disabled={!inputIsValid} onClick={handleSubmitButton} title={`Create ${itemModel}`}>
        {<Plus />}
      </Button>
      {showListItemInternals && (
        <div className={cn("my-2", { "bg-muted-foreground": canEdit /*editingInput */ })}>
          <span>itemDraft=</span>
          <code>{JSON.stringify(itemDraft)}</code>
        </div>
      )}
    </div>
  );
}
