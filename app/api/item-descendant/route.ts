// @/app/api/itemDescendant/route.ts

import { handleNestedItemDescendantListFromClient } from "@/actions/syncItemDescendant";
import { ItemDescendantClientStateType, itemDescendantClientStateSchema } from "@/schemas/itemDescendant";
import { deserializeItemDescendantState, serializeItemDescendantState } from "@/stores/itemDescendantStore/utils/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const responseBody = await request.text(); // Get response body as text
  const clientItem: ItemDescendantClientStateType | null =
    deserializeItemDescendantState<ItemDescendantClientStateType>(responseBody);
  if (clientItem) {
    itemDescendantClientStateSchema.parse(clientItem);
    const serverItem = await handleNestedItemDescendantListFromClient(clientItem);
    itemDescendantClientStateSchema.parse(clientItem);

    // Serialize the server state with the custom serializer for consistency.
    // This would not be necessary as here on the server, the state has no functions to be excluded,
    // as opposed to the client, where we are dealing with a Zustand store object
    const responseBody = serializeItemDescendantState(serverItem);
    // Send the response as JSON
    return new NextResponse(responseBody, { status: 200 });
  }
  return NextResponse.json({ error: "Expected a POST body of type `ItemDescendantClientStateType`" }, { status: 400 });
}
