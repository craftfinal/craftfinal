import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useItemInputState from "@/lib/utils/useItemInputState";
import { ClientIdType } from "@/types/item";
import { ItemDescendantModelNameType } from "@/types/itemDescendant";

export type RenderInputProps = {
  index: number;
  itemModel: ItemDescendantModelNameType;
  canEdit: boolean;
  showIdentifiers?: boolean;
  showSynchronization?: boolean;
  className?: string;
  itemIcon?: boolean;
};

export interface ResumeInputCardProps extends RenderInputProps {
  ancestorChain: Array<ClientIdType>;
}
export function ResumeInputCard(props: ResumeInputCardProps) {
  const { canEdit, className, /*inputFieldIndex, */ itemModel } = props;

  const { validationErrors, handleSubmitButton, handleCancelButton, formFields } = useItemInputState(props);

  return !canEdit ? null : (
    <Card className={cn("m-4 w-auto", className)}>
      <CardHeader>
        <CardTitle>Create new {itemModel}</CardTitle>
        <CardDescription>Fill in the required fields below to create and edit a new {itemModel}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-grow flex-col gap-y-4">
          <div className="flex flex-grow flex-wrap justify-between gap-x-4 gap-y-2">
            {formFields.map((formField) => {
              const {
                inputProps: { key, ...inputProps },
              } = formField;
              return (
                <div key={key} className="flex  flex-1 flex-col gap-y-2">
                  <Input {...inputProps} onChange={formField.onChange} />
                  {/* Display error message next to the input field */}
                  {validationErrors[key] && <Alert className="text-sm">{validationErrors[key]}</Alert>}
                </div>
              );
            })}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancelButton} title={`Discard data for ${itemModel}`}>
          Cancel
        </Button>
        <Button disabled={!!validationErrors} onClick={handleSubmitButton} title={`Create ${itemModel}`}>
          Create
        </Button>
      </CardFooter>
    </Card>
  );
}
