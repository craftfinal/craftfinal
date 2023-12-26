"use client";

import { ItemDescendantStoreProvider } from "@/contexts/ItemDescendantStoreContext";
import { generateClientId } from "@/schemas/id";
import { ItemClientStateType } from "@/schemas/item";
import { ItemDescendantClientStateType } from "@/schemas/itemDescendant";
import useAppSettingsStore from "@/stores/appSettings/useAppSettingsStore";
import { ItemDescendantStoreConfigType } from "@/stores/itemDescendantStore/createItemDescendantStore";
import { getParentModel } from "@/types/itemDescendant";
import RenderItem, { RenderItemProps } from "../itemDescendant/RenderItem";

export function RenderItemListClient({ itemList }: { itemList: Array<ItemDescendantClientStateType> }) {
  const itemModel = itemList[0].itemModel;
  const itemProps: Omit<RenderItemProps<ItemClientStateType>, "item" | "index"> = {
    itemModel,
    resumeAction: "edit",
  };

  const clientId = generateClientId(itemModel);
  const parentClientId = generateClientId(getParentModel(itemModel) || undefined);

  const storeConfigs: Array<ItemDescendantStoreConfigType> = [
    {
      itemModel,
      parentClientId,
      clientId,
      storeName: itemModel,

      useAppSettingsStore: useAppSettingsStore,
    } as ItemDescendantStoreConfigType,
  ];

  return (
    <ItemDescendantStoreProvider configs={storeConfigs}>
      {itemList.map((item, index) => {
        return <RenderItem {...itemProps} item={item} index={index} key={item.clientId} />;
      })}
    </ItemDescendantStoreProvider>
  );
}
