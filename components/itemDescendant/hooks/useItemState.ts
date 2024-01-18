import {
  FormValidationRecordType,
  InputFormFieldType,
  InputItemPersistInputProps,
  extractFormValidationErrors,
  getInputProps,
  getItemSchema,
  getSchemaFields,
  getUpdateFromEdiTextField,
  getUpdateFromEvent,
} from "@/lib/utils/itemDescendantListUtils";
import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputProps } from "react-editext";

import { useCurrentItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { ItemClientStateType, ItemDataUntypedType } from "@/schemas/item";
import { ClientIdType } from "@/types/item";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";

export interface ItemStateType {
  canEdit: boolean;
  isValid: boolean;
  itemIsDragable: boolean;
  setItemData: (descendantData: ItemDataUntypedType) => void;
  markItemAsDeleted: () => void;
  validationErrors: FormValidationRecordType;
  editingInput: boolean;
  setEditingInput: Dispatch<SetStateAction<boolean>>;
  formFields: Array<InputFormFieldType>;
}

interface ItemStateProps {
  item: ItemClientStateType;
  itemModel: ItemDescendantModelNameType;
  canEdit: boolean;
  ancestorChain: Array<ClientIdType>;
  itemIsDragable: boolean;
}
export default function useItemState(props: Readonly<ItemStateProps>) {
  const { ancestorChain, item, itemModel, canEdit, itemIsDragable } = props;

  const [editingInput, setEditingInput] = useState(canEdit);
  const [validationErrors, setValidationErrors] = useState<FormValidationRecordType>({});

  const store = useCurrentItemDescendantStore();
  const setDescendantData = store((state) => state.setDescendantData);
  const markDescendantAsDeleted = store((state) => state.markDescendantAsDeleted);

  const setItemData = (descendantData: ItemDataUntypedType): void => {
    setDescendantData(descendantData, item.clientId, ancestorChain);
  };
  const markItemAsDeleted = (): void => {
    markDescendantAsDeleted(item.clientId, ancestorChain);
  };

  const itemFormSchema = getItemSchema(itemModel, "form");
  const formFieldNames = getSchemaFields(itemModel, "display");

  const {
    // register,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemFormSchema),
  });

  const updateValidationStatus = () => {
    const validationStatus = itemFormSchema.safeParse({ ...item });
    const newValidationErrors = extractFormValidationErrors(validationStatus) as FormValidationRecordType;
    setValidationErrors(newValidationErrors);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const update = getUpdateFromEvent(itemFormSchema, event);
    if (update) {
      // Update the Zustand store
      setItemData(update);
      // Update form state
      updateValidationStatus();
    }
  };

  const handleSave = (value?: string, inputProps?: InputProps) => {
    const update = getUpdateFromEdiTextField(itemFormSchema, value, inputProps);
    if (update) {
      // Update the Zustand store
      setItemData(update);
      // Update form state
      updateValidationStatus();
    }
  };

  function isValid(): boolean {
    return Object.keys(validationErrors).length === 0;
  }

  const formFields: Array<InputFormFieldType> = formFieldNames.map((fieldName) => {
    const inputProps: InputItemPersistInputProps = getInputProps(item, itemModel, fieldName, handleChange);
    return { fieldName, inputProps, onSave: handleSave, editingInput, canEdit };
  });

  const itemState: ItemStateType = {
    isValid: isValid(),
    validationErrors,
    itemIsDragable,
    setItemData,
    markItemAsDeleted,
    editingInput,
    setEditingInput,
    canEdit,
    formFields,
  };
  return itemState;
}
