import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { InputProps } from "react-editext";
import { SafeParseReturnType, z } from "zod";
import {
  InputItemPersistInputProps,
  extractFieldName,
  getInitialItemDraftState,
  getInputProps,
  getItemSchema,
  getSchemaFields,
  isNumberField,
  formatValidationErrors,
} from "./itemDescendantListUtils";

import { useCurrentItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { ItemClientStateType, ItemDataType, ItemDataUntypedType } from "@/schemas/item";
import { ClientIdType } from "@/types/item";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type FormValidationRecordType = Record<string, string>;
interface FormFieldType extends InputItemPersistInputProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSave: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  editingInput: boolean;
  canEdit: boolean;
}
export interface ItemInputStateType {
  editingInput: boolean;
  setEditingInput: Dispatch<SetStateAction<boolean>>;
  draftValidationStatus: SafeParseReturnType<ItemDataUntypedType, ItemDataUntypedType>;
  handleSubmitButton: () => void;
  handleCancelButton: () => void;
  validationErrors: FormValidationRecordType;
  formFields: Array<FormFieldType>;
}
interface useItemInputStateProps {
  itemModel: ItemDescendantModelNameType;
  canEdit: boolean;
  ancestorChain: Array<ClientIdType>;
}
export default function useItemInputState(props: Readonly<useItemInputStateProps>) {
  const { ancestorChain, /*inputFieldIndex, */ itemModel, canEdit } = props;
  const [editingInput, setEditingInput] = useState(canEdit);

  // const [draftValidationStatus, setDraftValidationStatus] = useState<
  //   SafeParseReturnType<ItemDataUntypedType, ItemDataUntypedType>
  // >({} as SafeParseReturnType<ItemDataUntypedType, ItemDataUntypedType>);

  const [validationErrors, setValidationErrors] = useState<FormValidationRecordType>({} as FormValidationRecordType);

  const store = useCurrentItemDescendantStore();
  const getDescendantDraft = store((state) => state.getDescendantDraft);
  const updateDescendantDraft = store((state) => state.updateDescendantDraft);
  const commitDescendantDraft = store((state) => state.commitDescendantDraft);

  const getItemDraft = (): ItemDataType<ItemClientStateType> => {
    // window.consoleLog(`DescendantInput:getItemDraft(): ancestorChain=${JSON.stringify(ancestorChain)}`);
    return getDescendantDraft(ancestorChain);
  };

  const updateItemDraft = (descendantData: ItemDataUntypedType): void => {
    // window.consoleLog(`DescendantInput:updateItemDraft(descendantData=${descendantData}): ancestorChain=${JSON.stringify(ancestorChain)}`);
    updateDescendantDraft(descendantData, ancestorChain);
  };

  const commitItemDraft = (): void => {
    // window.consoleLog(`DescendantInput:commitItemDraft(): ancestorChain=${JSON.stringify(ancestorChain)}`,);
    commitDescendantDraft(ancestorChain);
  };

  const itemDraft = getItemDraft();

  const itemFormSchema = getItemSchema(itemModel, "form");
  const formFieldNames = getSchemaFields(itemModel, "display");

  type ItemFormDataType = z.output<typeof itemFormSchema>;
  type ItemDataFieldNameType = keyof ItemFormDataType;
  type ItemDataFieldValueType = string | number;

  // Initialize local state for field values
  const [itemDraftState, setItemDraftState] = useState(getInitialItemDraftState(itemDraft, formFieldNames));

  // Updadte validationStatus once when component mounts
  useEffect(() => {
    validate(itemDraft);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (newDraftState: ItemDataUntypedType) => {
    const validationStatus = itemFormSchema.safeParse(newDraftState);
    // setDraftValidationStatus(validationStatus);
    const validationErrors = formatValidationErrors(validationStatus) as FormValidationRecordType;
    setValidationErrors(validationErrors);
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
    const initialDraftState = formFieldNames.reduce((acc, field) => ({ ...acc, [field]: initialValue }), {});
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
    if (validationErrors.success) {
      commitItemDraft();
      // Reset field values after commit
      resetItemDraftAndState();
    } else {
      window.consoleLog(
        `handleSubmit: Validation failed. itemDraft:`,
        itemDraft,
        `draftValidationStatus:`,
        validationErrors,
      );
    }
  };

  const handleSubmitButton = () => {
    commitToStore();
  };

  const handleCancelButton = () => {
    resetItemDraftAndState();
  };

  const formFields = formFieldNames.map((fieldName) => {
    const inputProps = getInputProps(itemDraftState, itemModel, fieldName);
    return { inputProps, ...inputProps, onChange: handleChange, onSave: handleSave, editingInput, canEdit };
  });

  const inputProps = {
    editingInput,
    setEditingInput,
    draftValidationStatus: validationErrors,
    handleSubmitButton,
    handleCancelButton,
    validationErrors,
    formFieldNames,
    formFields,
  };
  return inputProps;
}
