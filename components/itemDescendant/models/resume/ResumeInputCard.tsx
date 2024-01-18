import useItemInputState from "@/components/itemDescendant/hooks/useItemInputState";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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

  const { isValid, validationErrors, createItem, resetDraft, formFields } = useItemInputState(props);

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
              const { fieldName, inputProps } = formField;
              return (
                <div key={fieldName} className="flex  flex-1 flex-col gap-y-2">
                  <Input {...inputProps} />
                  {validationErrors[fieldName] && <Alert className="text-sm">{validationErrors[fieldName]}</Alert>}
                </div>
              );
            })}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetDraft} title={`Discard data for ${itemModel}`}>
          Cancel
        </Button>
        <Button disabled={!isValid} onClick={createItem} title={`Create ${itemModel}`}>
          Create
        </Button>
      </CardFooter>
    </Card>
  );
}
