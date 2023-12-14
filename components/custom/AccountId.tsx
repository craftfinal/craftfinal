// @/components/custom/AccountId.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { IdSchemaType } from "@/schemas/id";

// Extending React.HTMLProps to include standard span element props
type AccountIdProps = React.HTMLProps<HTMLSpanElement> & {
  id: IdSchemaType;
};

export const AccountId = React.forwardRef<HTMLSpanElement, AccountIdProps>(({ id, className, ...props }, ref) => {
  if (!id) {
    return null;
  }

  return (
    <span className={cn("font-mono text-sm font-medium", className)} ref={ref} {...props}>
      {id.substring(0, 9)}&hellip;
    </span>
  );
});

AccountId.displayName = "AccountId";

export default AccountId;
