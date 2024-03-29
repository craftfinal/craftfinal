// @/lib/utils/itemDescendantListUtils.ts

import { achievementSchema } from "@/schemas/achievement";
import { ItemDataUntypedFieldNameType, ItemDataUntypedType } from "@/schemas/item";
import { organizationSchema } from "@/schemas/organization";
import { resumeSchema } from "@/schemas/resume";
import { roleSchema } from "@/schemas/role";
import { userSchema } from "@/schemas/user";
import { ItemDescendantModelNameType } from "@/types/itemDescendant";
import { InputProps } from "react-editext";
import { SafeParseReturnType, ZodNumber, ZodObject, ZodTypeAny } from "zod";

export type SchemaKindType = keyof Record<"form" | "display", ZodTypeAny>;

export const getItemSchema = (itemModel: ItemDescendantModelNameType, schemaKind: SchemaKindType) => {
  let schema: Record<SchemaKindType, ZodTypeAny>;

  switch (itemModel) {
    case "user":
      schema = userSchema;
      break;
    case "resume":
      schema = resumeSchema;
      break;
    case "organization":
      schema = organizationSchema;
      break;
    case "role":
      schema = roleSchema;
      break;
    case "achievement":
      schema = achievementSchema;
      break;
    default:
      throw Error(`getItemSchema(itemModel="${itemModel}", schemaKind="${schemaKind}"): Schema not found`);
      break;
  }

  return schema[schemaKind];
};

export const getSchemaFields = (itemModel: ItemDescendantModelNameType, schemaKind: SchemaKindType): string[] => {
  const schema = getItemSchema(itemModel, schemaKind);
  const shape = schema._def.shape();
  return Object.keys(shape);
};

// Utility to check if a field is a number type in the schema
export const isNumberField = (schema: ZodTypeAny, fieldName: string): boolean => {
  // Ensure the schema is an object schema
  if (schema instanceof ZodObject) {
    const fieldSchema = schema.shape[fieldName];
    return fieldSchema instanceof ZodNumber;
  }
  return false;
};
// // Convert array to union type
// type ItemFormFieldKeys = (typeof itemFormFields)[number];
// // Define updatedKeyValue type
// type FormKeyValueType = {
//   key: ItemFormFieldKeys;
//   value: string | number;
// };
type FormKeyValueType = Record<string, string | number>;
export function extractFieldName(input: string): ItemDataUntypedFieldNameType {
  const parts = input.split("-");
  return parts[parts.length - 1];
}

export type onChangeHandlerType = (
  event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
) => void;

export interface InputItemPersistInputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: onChangeHandlerType;
}

export function getInputProps(
  fieldValues: FieldValueMapType,
  itemModel: ItemDescendantModelNameType,
  fieldName: string,
  onChange: onChangeHandlerType,
): InputItemPersistInputProps {
  return {
    name: `${itemModel}-${fieldName}`,
    placeholder: `${fieldName} for ${itemModel}`,
    value: fieldValues[fieldName],
    onChange,
  };
}

export interface InputFormFieldType {
  fieldName: string;
  inputProps: InputItemPersistInputProps;
  onSave: (value?: string, inputProps?: InputProps) => void;
  editingInput: boolean;
  canEdit: boolean;
}

export function getInitialItemDraftState(itemDraft: ItemDataUntypedType, itemFormFields: string[]) {
  const fieldValueState = itemFormFields.reduce((acc, field) => {
    let initialFieldValue: string | number | undefined = undefined;
    if (itemDraft && field in itemDraft) {
      initialFieldValue = itemDraft[field];
    }
    const fieldDraft = { [field]: initialFieldValue };
    return { ...acc, ...fieldDraft };
  }, {} as FieldValueMapType);
  return fieldValueState;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldValueMapType = Record<string, any>;

function getUpdatedKeyValueFromEvent(
  event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
): FormKeyValueType | undefined {
  if (event && event.target?.name) {
    const updatedKeyValue = {
      key: extractFieldName(event.target.name),
      value: event.target.value,
    };
    return updatedKeyValue;
  }
}
function getUpdatedKeyValueFromEdiTextField(value?: string, inputProps?: InputProps): FormKeyValueType | undefined {
  if (value && inputProps?.name) {
    const updatedKeyValue = {
      key: extractFieldName(inputProps.name),
      value,
    };
    return updatedKeyValue;
  }
}
function parseUpdate(itemFormSchema: ZodTypeAny, updatedKeyValue: FormKeyValueType | undefined) {
  if (typeof updatedKeyValue === "undefined") return;
  // Check if the field is a number and parse it
  if (isNumberField(itemFormSchema, updatedKeyValue.key as string)) {
    if (typeof updatedKeyValue.value !== "number") {
      // Default to 0 if parsing fails
      updatedKeyValue = { ...updatedKeyValue, value: parseFloat(updatedKeyValue.value) || 0 };
    }
  }
  return { [updatedKeyValue.key]: updatedKeyValue.value };
}

export function getUpdateFromEvent(
  itemFormSchema: ZodTypeAny,
  event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
): ItemDataUntypedType | undefined {
  return parseUpdate(itemFormSchema, getUpdatedKeyValueFromEvent(event));
}

export type FormValidationRecordType = Record<keyof ItemDataUntypedType, string>;
export function extractFormValidationErrors(
  validationResult: SafeParseReturnType<ItemDataUntypedType, ItemDataUntypedType>,
): FormValidationRecordType {
  if (validationResult.success) {
    return {};
  }

  const errors: Partial<Record<keyof ItemDataUntypedType, string>> = {};
  validationResult.error.issues.forEach((issue) => {
    const fieldName = issue.path[0];
    if (typeof fieldName === "string" || typeof fieldName === "number") {
      errors[fieldName] = issue.message;
    }
  });
  return errors as Record<keyof ItemDataUntypedType, string>;
}

export function getUpdateFromEdiTextField(
  itemFormSchema: ZodTypeAny,
  value?: string,
  inputProps?: InputProps,
): ItemDataUntypedType | undefined {
  return parseUpdate(itemFormSchema, getUpdatedKeyValueFromEdiTextField(value, inputProps));
}
