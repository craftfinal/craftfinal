// @/components/itemDescendant/utils/EditableInputField.tsx

import { cn } from "@/lib/utils";
import EdiText, { EdiTextProps } from "react-editext";

interface EditableInputFieldProps extends EdiTextProps {
  fieldName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
}

// Note: ensure to reset padding-horizontal to zero in `inputProps.className` for
// every screen size
export const editableFieldInnerClassName = "py-2";
export const EditableFieldEdiTextProps = {
  containerProps: {
    className: "p-0 flex-grow",
  },
  inputProps: {
    placeholder: "",
    className: cn(editableFieldInnerClassName, "flex-1 rounded-md outline-none min-w-auto bg-transparent px-0"),
  },
  viewProps: {
    className: cn(editableFieldInnerClassName, "w-full h-full min-h-[2.5rem] rounded-md"),
  },
  rootProps: {
    viewContainerClassName: "w-full h-full p-0 rounded-md flex", //hover:outline-dotted hover:outline-slate-300 active:outline-2 hover:active:outline-2",
    editOnViewClick: true,
    startEditingOnFocus: true,
    submitOnEnter: true,
    saveButtonClassName: "hidden",
    editButtonClassName: "hidden",
    cancelButtonClassName: "hidden",
    // mainContainerClassName: "p-0",
    editContainerClassName: "p-0 rounded-md gap-x-2",
  },
};
export default function EditableField({
  fieldName,
  placeholder,
  onChange,
  inputProps,
  ...rest
}: EditableInputFieldProps) {
  return (
    <EdiText
      type="text"
      {...EditableFieldEdiTextProps.rootProps}
      inputProps={{
        ...EditableFieldEdiTextProps.inputProps,
        ...inputProps,
        name: fieldName,
        placeholder: placeholder ?? "",
        onChange: onChange,
      }}
      viewProps={{ ...EditableFieldEdiTextProps.viewProps }}
      {...rest}
    />
  );
}
