// @/components/itemDescendant/ItemDescendant.client.tsx

"use client";

import { ItemDescendantStoreProvider, useItemDescendantStore } from "@/contexts/ItemDescendantStoreContext";
import { ResumeActionProvider } from "@/contexts/ResumeActionContext";
import { StoreNameProvider, useStoreName } from "@/contexts/StoreNameContext";
import { generateClientId } from "@/schemas/id";
import { ItemClientStateType, ItemDataType, ItemDataUntypedType } from "@/schemas/item";
import { ItemDescendantClientStateType, ItemDescendantServerStateType } from "@/schemas/itemDescendant";
import useAppSettingsStore from "@/stores/appSettings/useAppSettingsStore";
import { ClientIdType } from "@/types/item";
import { ItemDescendantModelNameType, getDescendantModel, getParentModel } from "@/types/itemDescendant";
import { ResumeActionType } from "@/types/resume";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import Item from "./Item";
import RestoreItemDialog from "./RestoreItemDialog";
import Descendant from "./descendant/Descendant";
import DescendantInput from "./descendant/DescendantInput";
import DescendantList from "./descendant/DescendantList";
import { AutoSync } from "./utils/AutoSync";
import ItemDescendantListSynchronization from "./utils/SyncButton";

export interface ItemDescendantRenderProps {
  index: number;
  inputFieldIndex: number;
  ancestorClientIdChain: Array<ClientIdType>;
  // id: string;
  item: ItemDescendantClientStateType;
  itemModel: ItemDescendantModelNameType;
  rootItemModel: ItemDescendantModelNameType;
  leafItemModel: ItemDescendantModelNameType;
  resumeAction: ResumeActionType;
  editingInput: boolean;
  setEditingInput: Dispatch<SetStateAction<boolean>>;
  setDescendantData: (
    descendantData: ItemDataUntypedType,
    clientId: ClientIdType,
    ancestorClientIds: Array<ClientIdType>,
  ) => void;
  // addDescendant: (descendantData: ItemDataType<C>) => void; // FIXME: Untested
  markDescendantAsDeleted: (clientId: ClientIdType, ancestorClientIds: Array<ClientIdType>) => void;
  // reArrangeDescendants: (reArrangedDescendants: ItemDescendantClientStateListType) => void;
  // resetDescendantsOrderValues: () => void;
  getDescendantDraft: (ancestorClientIds: Array<ClientIdType>) => ItemDataType<ItemClientStateType>;
  updateDescendantDraft: (descendantData: ItemDataUntypedType, ancestorClientIds: Array<ClientIdType>) => void;
  commitDescendantDraft: (ancestorClientIds: Array<ClientIdType>) => void;
  showIdentifiers: boolean;
  showSynchronization: boolean;
  className?: string;
  itemIcon?: boolean;
}
function ItemDescendantListRender(props: ItemDescendantRenderProps): ReactNode {
  const { ancestorClientIdChain, item, rootItemModel, leafItemModel, editingInput, showSynchronization } = props;
  const { itemModel, descendantModel, descendants } = item;

  let inputFieldIndex = props.inputFieldIndex;
  const atRootLevel = itemModel === rootItemModel;
  if (!descendantModel) return;

  const descendantDescendantModel = getDescendantModel(descendantModel);

  const modelClassname: Record<ItemDescendantModelNameType, string> = {
    user: "",
    resume: "bg-muted-foreground/50 dark:bg-background/50",
    organization: "bg-muted-foreground/30 dark:bg-background/30",
    role: "bg-muted-foreground/10 dark:bg-background/10",
    achievement: "",
  };
  const itemModelClassname = () => {
    return editingInput && itemModel ? modelClassname[itemModel] : "";
  };
  const descendantModelClassname = () => {
    return editingInput && itemModel ? modelClassname[descendantModel] : "";
  };

  // Props for descendants of current item have the same ancestorClientIdChain
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const descendantListItemProps = {
    ...props,
    className: "my-4 flex flex-col gap-2 border-solid border-slate-500/20 lg:my-8 lg:gap-3 xl:gap-4",
  };

  const itemProps = {
    ...props,
    className: itemModelClassname(),
  };

  // Props for descendants of current item have the same ancestorClientIdChain
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const descendantProps = {
    ...props,
    className: descendantModelClassname(),
    inputFieldIndex: inputFieldIndex,
    itemModel: descendantModel,
    descendantModel: descendantDescendantModel,
    parentId: item.id,
    parentClientId: item.clientId,
    ancestorClientIdChain: [item.clientId, ...ancestorClientIdChain],
  };

  const showInput = editingInput && item.descendantModel !== leafItemModel && descendantDescendantModel;

  return (
    <>
      {item.deletedAt ? <RestoreItemDialog {...descendantProps} /> : null}
      {atRootLevel && editingInput && showSynchronization ? <ItemDescendantListSynchronization /> : null}
      {atRootLevel ? <Item {...itemProps} /> : <Descendant {...itemProps} />}
      {item.descendantModel === leafItemModel ? (
        <DescendantList {...descendantProps} />
      ) : (
        <>
          {/* {!showInput ? null : <DescendantInput {...descendantProps} inputFieldIndex={inputFieldIndex++} />} */}
          <ul
            key={item.clientId}
            // className={cn("my-4 border-solid border-slate-500/20 pl-2 lg:my-8 lg:pl-4 xl:pl-8", {
            //   " border-t-4 bg-slate-300/10 dark:bg-slate-800/10": descendantModel === "resume",
            //   "border-t-2 bg-slate-200/25 dark:bg-slate-900/25": descendantModel === "organization",
            //   "bg-slate-200/50 dark:bg-slate-900/50": descendantModel === "role",
            // })}
          >
            {descendants
              ?.filter((descendant) => !descendant.deletedAt)
              .map((descendant, descendantIndex) => (
                <li key={descendant.clientId} className={descendantListItemProps.className}>
                  <ItemDescendantListRender
                    {...descendantProps}
                    index={descendantIndex}
                    item={descendant}
                    inputFieldIndex={inputFieldIndex}
                  />
                  {/*
                    !editingInput || item.descendantModel === leafItemModel || !descendantDescendantModel ? (
                      <div>{`editingInput=${editingInput} item.descendantModel === leafItemModel=${
                        item.descendantModel === leafItemModel
                      } !descendantDescendantModel=${!descendantDescendantModel}: Not showing <DescendantInput />`}</div>
                    ) : null
                    <DescendantInput {...descendantProps} />
                  */}
                </li>
              ))}
            <li key={item.clientId} className={descendantListItemProps.className}>
              {!showInput ? null : <DescendantInput {...descendantProps} inputFieldIndex={inputFieldIndex++} />}
            </li>
          </ul>
        </>
      )}
    </>
  );
}

interface ItemDescendantListStateProps extends ItemDescendantListContextProps {}
function ItemDescendantListState(props: ItemDescendantListStateProps) {
  const [storeIsInitialized, setStoreIsInitialized] = useState(false);

  const globalStoreName = useStoreName();
  const store = useItemDescendantStore(globalStoreName);
  const rootState = store((state) => state);
  const updateStoreWithServerData = store((state) => state.updateStoreWithServerData);
  const [editingInput, setEditingInput] = useState(props.resumeAction === "edit");
  const setDescendantData = store((state) => state.setDescendantData);
  const markDescendantAsDeleted = store((state) => state.markDescendantAsDeleted);

  const getDescendantDraft = store((state) => state.getDescendantDraft);
  const updateDescendantDraft = store((state) => state.updateDescendantDraft);
  const commitDescendantDraft = store((state) => state.commitDescendantDraft);

  const settingsStore = useAppSettingsStore();
  const { showItemDescendantIdentifiers, showItemDescendantSynchronization } = settingsStore;
  const showIdentifiers = process.env.NODE_ENV === "development" && showItemDescendantIdentifiers;
  const showSynchronization = process.env.NODE_ENV === "development" && showItemDescendantSynchronization;

  const { serverState } = props;

  const clientProps = {
    ...props,
    index: 0,
    inputFieldIndex: 0,
    ancestorClientIdChain: [],
    item: rootState,
    itemModel: props.rootItemModel,
    editingInput,
    setEditingInput,
    setDescendantData,
    markDescendantAsDeleted,
    getDescendantDraft,
    updateDescendantDraft,
    commitDescendantDraft,
    showIdentifiers,
    showSynchronization,
  };

  // window.consoleLog(
  //   `ItemDescendantClientContext: ${JSON.stringify(
  //     rootState.descendants.filter((descendant) => !descendant.deletedAt),
  //     undefined,
  //     2,
  //   )}`,
  // );
  useEffect(() => {
    if (updateStoreWithServerData && !storeIsInitialized) {
      // window.consoleLog(`ItemDescendantClientContext: useEffect with serverState:`, serverState);
      updateStoreWithServerData(serverState);
      setStoreIsInitialized(true);
    }
  }, [serverState, storeIsInitialized, updateStoreWithServerData]);

  return !storeIsInitialized ? null : (
    <>
      <AutoSync />
      <ItemDescendantListRender {...clientProps} />
    </>
  );
}

export interface ItemDescendantListContextProps {
  serverState: ItemDescendantServerStateType;
  rootItemModel: ItemDescendantModelNameType;
  leafItemModel: ItemDescendantModelNameType;
  resumeAction: ResumeActionType;
}

export default function ItemDescendantListContext(props: ItemDescendantListContextProps) {
  const { serverState, rootItemModel: itemModel, resumeAction } = props;

  const parentClientId = generateClientId(getParentModel(itemModel) || undefined);
  const clientId = generateClientId(itemModel);
  const parentId = serverState.parentId;
  const id = serverState.id;

  return (
    <ResumeActionProvider resumeAction={resumeAction}>
      <StoreNameProvider storeName={`${itemModel}`}>
        <ItemDescendantStoreProvider configs={[{ itemModel, parentClientId, clientId, parentId, id }]}>
          <ItemDescendantListState {...props} />
        </ItemDescendantStoreProvider>
      </StoreNameProvider>
    </ResumeActionProvider>
  );
}
