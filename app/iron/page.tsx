import Link from "next/link";

import { Metadata } from "next";
import { Form } from "./Form";
import { Suspense } from "react";
// import * as css from "@/app/css";
// import { Title } from "../title";
// import { GetTheCode } from "../../get-the-code";

export const metadata: Metadata = {
  title: "🛠 iron-session examples: Server components, and server actions",
};

export default async function AppRouter() {
  return (
    <main className="space-y-5 p-10">
      {/* <Title subtitle="+ server components, and server actions" /> */}

      <p className="max-w-xl italic">
        <u>How to test</u>: Login and refresh the page to see iron-session in action.
      </p>

      <div className="grid max-w-xl grid-cols-1 gap-4 rounded-md border border-slate-500 p-10">
        <Suspense fallback={<p className="text-lg">Loading...</p>}>
          <Form />
        </Suspense>
      </div>

      {/* <GetTheCode path="app/iron-session" /> */}
      <HowItWorks />

      <p>
        <Link href="/" /*className={css.link}*/>← All examples</Link>
      </p>
    </main>
  );
}

function HowItWorks() {
  return (
    <details className="max-w-2xl space-y-4">
      <summary className="cursor-pointer">How it works</summary>

      <ol className="list-inside list-decimal">
        <li>During login, the page uses a server action.</li>
        <li>During logout, the page uses a server action.</li>
        <li>When displaying session data, the server component gets the data and pass it to the page.</li>
      </ol>
    </details>
  );
}
