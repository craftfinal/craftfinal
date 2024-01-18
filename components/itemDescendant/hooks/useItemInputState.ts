import {
  FormValidationRecordType,
  InputFormFieldType,
  InputItemPersistInputProps,
  extractFieldName,
  extractFormValidationErrors,
  getInitialItemDraftState,
  getInputProps,
  getItemSchema,
  getSchemaFields,
  isNumberField,
} from "@/lib/utils/itemDescendantListUtils";
import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { InputProps } from "react-editext";
import { SafeParseReturnType, z } from "zod";

import { useCurrentItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { ItemClientStateType, ItemDataType, ItemDataUntypedType } from "@/schemas/item";
import { ClientIdType } from "@/types/item";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export interface ItemInputStateType {
  draftValidationStatus: SafeParseReturnType<ItemDataUntypedType, ItemDataUntypedType>;
  createItem: () => void;
  resetDraft: () => void;
  validationErrors: FormValidationRecordType;
  editingInput: boolean;
  setEditingInput: Dispatch<SetStateAction<boolean>>;
  formFields: Array<InputFormFieldType>;
}

interface ItemInputStateProps {
  itemModel: ItemDescendantModelNameType;
  canEdit: boolean;
  ancestorChain: Array<ClientIdType>;
}
export default function useItemInputState(props: Readonly<ItemInputStateProps>) {
  const { ancestorChain, itemModel, canEdit } = props;
  const [editingInput, setEditingInput] = useState(canEdit);

  const [validationErrors, setValidationErrors] = useState<FormValidationRecordType>({});

  const store = useCurrentItemDescendantStore();
  const getDescendantDraft = store((state) => state.getDescendantDraft);
  const updateDescendantDraft = store((state) => state.updateDescendantDraft);
  const commitDescendantDraft = store((state) => state.commitDescendantDraft);

  const getItemDraft = (): ItemDataType<ItemClientStateType> => {
    return getDescendantDraft(ancestorChain);
  };

  const updateItemDraft = (descendantData: ItemDataUntypedType): void => {
    updateDescendantDraft(descendantData, ancestorChain);
  };

  const commitItemDraft = (): void => {
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
    const newValidationErrors = extractFormValidationErrors(validationStatus) as FormValidationRecordType;
    setValidationErrors(newValidationErrors);
  };

  const updateItemDraftAndState = (fieldSpec: string, valueSpec: string) => {
    const fieldName: ItemDataFieldNameType = extractFieldName(fieldSpec);
    let newValue: ItemDataFieldValueType = valueSpec;
    if (isNumberField(itemFormSchema, fieldName)) {
      newValue = parseFloat(newValue) || 0; // Default to 0 if parsing fails
    }
    const newDraftState = { ...itemDraft, [fieldName]: newValue };
    setItemDraftState(newDraftState);
    updateItemDraft({ ...newDraftState });
    validate(newDraftState);
  };

  const resetItemDraftAndState = (initialValue: string | null | undefined = "") => {
    const initialDraftState = formFieldNames.reduce((acc, field) => ({ ...acc, [field]: initialValue }), {});
    setItemDraftState(initialDraftState);
    updateItemDraft({ ...initialDraftState });
    validate(initialDraftState);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (event.target.name) {
      updateItemDraftAndState(event.target.name, event.target.value);
    }
  };

  const handleSave = (value?: string, inputProps?: InputProps) => {
    if (value && inputProps?.name) {
      updateItemDraftAndState(inputProps.name, value);
    }
    return createItem();
  };

  const createItem = () => {
    validate(itemDraft);
    if (isValid()) {
      commitItemDraft();
      resetItemDraftAndState();
    }
  };

  const resetDraft = () => {
    resetItemDraftAndState();
  };

  function isValid(): boolean {
    return Object.keys(validationErrors).length === 0;
  }

  const formFields: Array<InputFormFieldType> = formFieldNames.map((fieldName) => {
    const inputProps: InputItemPersistInputProps = getInputProps(itemDraftState, itemModel, fieldName, handleChange);
    return { fieldName, inputProps, onSave: handleSave, editingInput, canEdit };
  });

  const itemInputState = {
    isValid: isValid(),
    validationErrors,
    createItem,
    resetDraft,
    editingInput,
    setEditingInput,
    formFields,
  };
  return itemInputState;
}
