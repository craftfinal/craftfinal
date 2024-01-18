import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ResumeItemClientStateType } from "@/schemas/resume";
import { ClientIdType } from "@/types/item";
import { RenderItemProps } from "../../RenderItem";
import useItemState from "../../hooks/useItemState";

export interface ResumeItemCardProps extends Omit<RenderItemProps<ResumeItemClientStateType>, "item"> {
  item: ResumeItemClientStateType;
  ancestorChain: Array<ClientIdType>;
  canEdit: boolean;
  itemIsDragable: boolean;
}
export function ResumeItemCard(props: ResumeItemCardProps) {
  const { itemModel, className } = props;
  const { validationErrors, markItemAsDeleted, formFields } = useItemState(props);

  const headerFields = {
    title: "name",
    description: "description",
  };

  const nameField = formFields.find((field) => field.fieldName === headerFields.title);
  const descriptionField = formFields.find((field) => field.fieldName === headerFields.description);
  return (
    <Card className={cn("m-4 w-auto", className)}>
      <CardHeader>
        <CardTitle>{nameField && <Input {...nameField.inputProps} />}</CardTitle>
        <CardDescription>{descriptionField && <Input {...descriptionField.inputProps} />}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-grow flex-col gap-y-4">
          <div className="flex flex-grow flex-wrap justify-between gap-x-4 gap-y-2">
            {formFields
              .filter((formField) => Object.keys(headerFields).includes(formField.fieldName))
              .map((formField) => {
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
        <Button variant="destructive" onClick={markItemAsDeleted} title={`Delete ${itemModel}`}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
