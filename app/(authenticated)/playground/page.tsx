import { siteConfig } from "@/config/site";
import CurrentUser from "./CurrentUser.server";
import ArticleLayoutMDX from "@/layouts/ArticleLayoutMDX";

export default function PlaygroundPage() {
  return (
    <ArticleLayoutMDX className="container">
      <h1>{siteConfig.name} playground</h1>
      <p>This is an evolving demonstration of the the core features of CraftFinal.</p>
      <CurrentUser />
      <h2>What you can experiment with right now</h2>
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
    </ArticleLayoutMDX>
  );
}
