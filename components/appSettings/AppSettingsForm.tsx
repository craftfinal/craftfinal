// components/appSettings/AppSettingsForm.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormLabel } from "@/components/ui/form";
import { appSettingsSchema } from "@/schemas/appSettings";
import { itemDescendantSettingsSchema } from "@/schemas/itemDescendantSettings";
import useAppSettingsStore, {
  AppSettingsType,
  ItemDescendantSettingsType,
} from "@/stores/appSettings/useAppSettingsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { DialogClose } from "../ui/dialog";
import { Input } from "../ui/input";

type FormValueType = string | number | boolean;
const componentSchemas = {
  appSettings: appSettingsSchema,
  itemDescendantSettings: itemDescendantSettingsSchema,
};

const unifiedSchema = z.object({
  appSettings: appSettingsSchema,
  itemDescendantSettings: itemDescendantSettingsSchema,
});
type UnifiedSettingsType = z.infer<typeof unifiedSchema>;

export default function AppSettingsForm() {
  const devel = process.env.NODE_ENV === "development";
  const appSettings = useAppSettingsStore((state) => state.app);
  const itemDescendantSettings = useAppSettingsStore((state) => state.itemDescendant);
  const setAppSettings = useAppSettingsStore((state) => state.setAppSettings);
  const setItemDescendantSettings = useAppSettingsStore((state) => state.setItemDescendantSettings);

  const form = useForm<UnifiedSettingsType>({
    resolver: zodResolver(unifiedSchema),
    defaultValues: { appSettings, itemDescendantSettings },
  });

  const updateStoreIfValid = async <T extends keyof AppSettingsType | keyof ItemDescendantSettingsType>(
    categoryKey: "appSettings" | "itemDescendantSettings",
    name: T,
    value: FormValueType,
  ) => {
    const fieldName = `${categoryKey}.${name}`; // Construct the complete field name
    // Use a type assertion here to inform TypeScript about the structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue(fieldName as keyof UnifiedSettingsType, value as any);
    const isValid = await form.trigger(fieldName as keyof UnifiedSettingsType);
    if (isValid) {
      if (categoryKey === "appSettings") {
        setAppSettings({ ...appSettings, [name]: value });
      } else if (categoryKey === "itemDescendantSettings") {
        setItemDescendantSettings({ ...itemDescendantSettings, [name]: value });
      }
    }
  };

  const onSubmit = (data: UnifiedSettingsType) => {
    setAppSettings(data.appSettings);
    setItemDescendantSettings(data.itemDescendantSettings);
  };

  const renderFields = (
    categorySchema: typeof appSettingsSchema | typeof itemDescendantSettingsSchema,
    categoryKey: keyof UnifiedSettingsType,
  ) => {
    return Object.entries(categorySchema.shape).map(([key, schema]) => {
      const fieldType =
        schema instanceof z.ZodBoolean ? "boolean" : schema instanceof z.ZodNumber ? "number" : "string";
      const fieldName = `${categoryKey}.${key}` as keyof UnifiedSettingsType;

      return (
        <div key={fieldName} className="form-item">
          {fieldType === "boolean" ? (
            <div className="flex items-center space-x-2">
              <Controller
                name={fieldName}
                control={form.control}
                render={({ field }) => (
                  <>
                    <Checkbox
                      id={fieldName}
                      {...{ ...field, value: undefined }}
                      checked={field.value as unknown as boolean}
                      onCheckedChange={(checked) => {
                        updateStoreIfValid(
                          categoryKey,
                          key as keyof AppSettingsType | keyof ItemDescendantSettingsType,
                          checked,
                        );
                      }}
                    />
                    <FormLabel htmlFor={fieldName} className="font-normal">
                      {key}
                    </FormLabel>
                  </>
                )}
              />
            </div>
          ) : (
            <>
              <FormLabel htmlFor={fieldName} className="font-normal">
                {key}
              </FormLabel>
              <Input
                {...form.register(fieldName)}
                onChange={(event) => {
                  const rawValue = event?.target?.value;
                  if (rawValue !== undefined) {
                    const value = fieldType === "number" ? Number(rawValue) : rawValue;
                    updateStoreIfValid(
                      categoryKey,
                      key as keyof AppSettingsType | keyof ItemDescendantSettingsType,
                      value,
                    );
                  }
                }}
              />
            </>
          )}
        </div>
      );
    });
  };

  interface FormSectionType {
    id: keyof UnifiedSettingsType;
    title: ReactNode;
    predicate: () => boolean;
  }
  const formSections: Array<FormSectionType> = [
    { id: "appSettings", title: <>App settings</>, predicate: () => devel },
    { id: "itemDescendantSettings", title: <>ItemDescendant settings</>, predicate: () => devel },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        {formSections.map((section, index) => {
          return (
            section.predicate() && (
              <Fragment key={section.id}>
                {index > 0 && <hr className="my-2 md:my-4 xl:my-6" />}
                <h3>{section.title}</h3>
                {renderFields(componentSchemas[section.id], section.id)}
              </Fragment>
            )
          );
        })}
        <DialogClose asChild>
          <Button type="submit">Close</Button>
        </DialogClose>
      </form>
    </Form>
  );
}
