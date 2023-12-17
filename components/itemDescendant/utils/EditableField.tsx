// @/components/itemDescendant/utils/EditableInputField.tsx

import EdiText, { EdiTextProps } from "react-editext";

interface EditableInputFieldProps extends EdiTextProps {
  fieldName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const EditableFieldEdiTextProps = {
  containerProps: {
    className: "p-0 flex-grow",
  },
  inputProps: {
    placeholder: "",
    className: "p-2 flex-1 rounded-md outline-none min-w-auto bg-transparent",
  },
  viewProps: {
    className: "w-full h-full min-h-[2.5rem] p-2 rounded-md",
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
        placeholder: placeholder || "",
        onChange: onChange,
      }}
      viewProps={{ ...EditableFieldEdiTextProps.viewProps }}
      {...rest}
    />
  );
}
