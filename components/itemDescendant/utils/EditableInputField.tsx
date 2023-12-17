// @/components/itemDescendant/utils/EditableInputField.tsx

import { cn } from "@/lib/utils";
import EdiText, { EdiTextProps } from "react-editext";
import { EditableFieldEdiTextProps } from "./EditableField";

interface EditableInputFieldProps extends EdiTextProps {
  fieldName: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function EditableInputField({
  fieldName,
  placeholder,
  onChange,
  inputProps,
  ...rest
}: EditableInputFieldProps) {
  return (
    <EdiText
      type="text"
      className="flex-grow"
      {...EditableFieldEdiTextProps.rootProps}
      inputProps={{
        ...EditableFieldEdiTextProps.inputProps,
        ...inputProps,
        name: fieldName,
        placeholder: placeholder || "",
        onChange: onChange,
        className: cn(EditableFieldEdiTextProps.inputProps.className, "px-0"),
      }}
      viewProps={{ ...EditableFieldEdiTextProps.viewProps }}
      {...rest}
    />
  );
}
