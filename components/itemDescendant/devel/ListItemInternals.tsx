import { cn } from "@/lib/utils";
import { DateTimeFormat, DateTimeSeparator, dateToISOLocal } from "@/lib/utils/formatDate";
import { ItemClientStateType } from "@/schemas/item";
import { ItemDescendantClientStateType } from "@/schemas/itemDescendant";
import { ItemDisposition } from "@/types/item";
import { RenderItemProps } from "../RenderItem";

export function ListItemInternals(props: RenderItemProps<ItemClientStateType | ItemDescendantClientStateType>) {
  const { index, item } = props;
  return (
    <div className="flex cursor-auto items-center gap-x-4 px-4 py-2 text-xs text-slate-600">
      <p className="flex h-full items-center bg-slate-200 px-2 text-lg">{index}</p>
      <table>
        <tbody>
          <tr>
            <td
              className={cn("py-0", {
                "text-red-500": item.disposition !== ItemDisposition.Synced,
              })}
            >
              {item.disposition}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="w-auto">
        <tbody>
          <tr>
            <td
              className={cn("py-0", {
                "text-red-500": item.disposition !== ItemDisposition.Synced,
              })}
            >
              <span className="text-xs text-muted-foreground">modified</span>:&nbsp;
              <span className="py-0">
                {dateToISOLocal(item.lastModified, DateTimeFormat.MonthDayTime, DateTimeSeparator.Newline)}
              </span>
            </td>
          </tr>
          <tr>
            <td className={"py-0"}>
              <span className="text-xs text-muted-foreground">created</span>:&nbsp;
              {dateToISOLocal(item.createdAt, DateTimeFormat.MonthDayTime, DateTimeSeparator.Newline)}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="w-auto">
        <tbody>
          <tr>
            <td className="py-0">
              <span className="text-xs text-muted-foreground">client</span>&nbsp;
              <code>{item.clientId?.substring(0, 8)}&hellip;</code>
            </td>
          </tr>
          <tr>
            <td className="py-0">
              <span className="text-xs text-muted-foreground">server</span>&nbsp;
              <code>{item.id?.substring(0, 8)}&hellip;</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
