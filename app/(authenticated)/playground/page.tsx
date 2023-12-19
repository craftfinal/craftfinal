// @/app/(authenticated)/playground/page.tsx

"use server;";

import { getCurrentAccountOrNull } from "@/actions/user";
import WrapMDX from "@/layouts/mdx/WrapMDX";
import EnterPlaygroundButtonClient from "./EnterPlaygroundButton.client";

export default async function PlaygroundPage() {
  // Fetch current user on the server
  const currentAccount = await getCurrentAccountOrNull();
  return (
    <div className="flex flex-col gap-y-8">
      <WrapMDX className="prose">
        <h1>Playground</h1>
        <p>This is an evolving demonstration of the core features of CraftFinal.</p>
      </WrapMDX>
      <div className="flex flex-wrap gap-4">
        {/* <CurrentAccountCard account={currentAccount} /> */}
        {/* <CurrentAccountCardClient account={currentAccount} /> */}
        {/* <EnterPlaygroundButton account={currentAccount} /> */}
        <EnterPlaygroundButtonClient account={currentAccount} />
      </div>
      <WrapMDX>
        <h2>Scope of playground</h2>
        <p>As of December 2023, you can experience the following:</p>
        <ul>
          <li>Create a new resume</li>
          <li>Add organizations, roles and achievements</li>
          <li>Edit all of these items</li>
          <li>Re-order achievements via drag and drop</li>
        </ul>
        <h2>Scope planned for January 2023</h2>
        <ul>
          <li>Complete end-to-end demonstration of the envisioned user experience at the example of a resume.</li>
        </ul>
      </WrapMDX>
    </div>
  );
}
