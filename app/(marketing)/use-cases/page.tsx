"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export default function UseCasePage() {
  interface CollapsibleState {
    pedro: boolean;
    consulting: boolean;
    projects: boolean;
    academia: boolean;
  }
  const [isOpen, setIsOpen] = useState<CollapsibleState>({
    pedro: false,
    consulting: false,
    projects: false,
    academia: false,
  });
  function toggleCollapsible(topic: keyof CollapsibleState) {
    setIsOpen({ ...isOpen, [topic]: !isOpen[topic] });
  }

  return (
    <>
      <h1>When “Deja Vu” actually is</h1>
      <p>
        <strong>CraftFinal</strong> is a state-of-the-art web application that revolutionizes the development of
        critical documents: <strong>pitch documents</strong> for a variety of professional settings.
      </p>
      <h2>The Core Problem and Our Solution</h2>
      <p>
        In the art of storytelling, iteration is vital yet often overlooked. <strong>CraftFinal</strong> makes this
        iterative process engaging and efficient, catering to various industries with its unique approach.
      </p>
      <h3>Industry-Specific Applications of CraftFinal</h3>
      <h4>
        1. <strong>Consulting Pitch Decks for RFPs</strong>
      </h4>
      <p>
        In the consulting industry, responding to Requests for Proposals (RFPs) requires precision and customization.
      </p>

      <Collapsible
        open={isOpen["consulting"]}
        onOpenChange={() => {
          toggleCollapsible("consulting");
        }}
        className="flex flex-col space-y-2"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center justify-start gap-x-4 rounded-none p-6 text-lg xl:text-xl"
          >
            <ChevronsUpDown className="h-4 w-4" />
            <h5>The pain points of consulting pitch decks</h5>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-muted-foreground/20 p-6">
          <p>
            Consulting firms constantly work to standardize their offerings like maturity assessments, risk assessments,
            IT architecture, and data governance models. Yet, the nature of consulting demands a high degree of
            personalization for each client pitch. This paradox creates a unique set of challenges:
          </p>
          <ul>
            <li>
              <p>
                <strong>Lack of Efficient Content Management</strong>: Consultants use tools like PowerPoint and Word
                for creating pitch decks, which often start with a “dot-dash” storyline format. However, these tools do
                not provide an efficient way to manage or overview the “dot” (slide headings) and “dash” (slide
                contents) elements used in previous pitches.
              </p>
            </li>
            <li>
              <p>
                <strong>Time-Consuming File Searches</strong>: Without a centralized content repository, consultants
                spend excessive time searching through previous documents to find relevant content. This process is not
                only time-consuming but also prone to overlooking valuable content.
              </p>
            </li>
            <li>
              <p>
                <strong>Repetitive Work and Inconsistencies</strong>: The inability to effectively track past content
                often leads to consultants unknowingly recreating similar slides or content. This repetition not only
                increases workload but also risks introducing inconsistencies and errors in the pitch decks.
              </p>
            </li>
            <li>
              <p>
                <strong>Suboptimal Customization for Clients</strong>: When consultants lack quick access to a broad
                range of previously used content, the ability to tailor pitches specifically for each client is limited.
                This may result in less impactful pitches that do not fully leverage the consultant‘s accumulated
                knowledge and expertise.
              </p>
            </li>
          </ul>
          <p>
            <em>
              Without CraftFinal, consultants face significant challenges in efficiently managing, customizing, and
              optimizing their pitch decks, leading to increased workloads and potentially less effective client
              engagements.
            </em>
          </p>
        </CollapsibleContent>
      </Collapsible>

      <p>Consultants often use a “dot-dash” format to create their storylines:</p>
      <ul>
        <li>
          <strong>Dot (Heading Level)</strong>: The main theme or key point of a slide.
        </li>
        <li>
          <strong>Dash (Content Level)</strong>: Detailed points supporting the main theme.
        </li>
      </ul>
      <p>
        <strong>CraftFinal</strong> assists consultants in:
      </p>
      <ul>
        <li>
          <strong>Providing Templates</strong>: Offering a range of dot-dash templates that align with common consulting
          frameworks.
        </li>
        <li>
          <strong>Historical Content Integration</strong>: Allowing consultants to import previous pitches, which{" "}
          <strong>CraftFinal</strong> analyzes to suggest relevant dots and dashes.
        </li>
        <li>
          <strong>Tailored Suggestions</strong>: Generating context-specific content suggestions, improving both the
          dots and dashes based on the specific RFP requirements.
        </li>
      </ul>
      <p>
        <em>
          In essence, <strong>CraftFinal</strong> streamlines the pitch creation process for consultants, ensuring each
          proposal is tailored and impactful.
        </em>
      </p>
      <h4>
        2. <strong>Project Proposal Pitch Decks in Large Corporations</strong>
      </h4>
      <p>
        <strong>CraftFinal</strong> supports the creation of project proposal decks within large corporations, where the
        challenge is to effectively communicate complex ideas to stakeholders.
      </p>

      <Collapsible
        open={isOpen["projects"]}
        onOpenChange={() => {
          toggleCollapsible("projects");
        }}
        className="flex flex-col space-y-2"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center justify-start gap-x-4 rounded-none p-6 text-lg xl:text-xl"
          >
            <ChevronsUpDown className="h-4 w-4" />
            <h5>The challenges with project proposal pitch decks</h5>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-muted-foreground/20 p-6">
          <p>
            Large corporations often require the development of project proposals that are both comprehensive and
            convincing. Without a tool like CraftFinal, professionals in this environment face several issues:
          </p>
          <ul>
            <li>
              <p>
                <strong>Complex Data Integration</strong>: Gathering and integrating diverse data from various corporate
                databases into a cohesive proposal is challenging. Traditional tools lack the capability to seamlessly
                merge this data into a compelling narrative.
              </p>
            </li>
            <li>
              <p>
                <strong>Time-Intensive Content Creation</strong>: Creating a project proposal in a large corporation
                often involves navigating through multiple layers of information and approval. Without an efficient
                tool, this process becomes lengthy and cumbersome.
              </p>
            </li>
            <li>
              <p>
                <strong>Difficulty in Tailoring to Stakeholder Preferences</strong>: Understanding and addressing the
                specific preferences and expectations of various stakeholders in a corporate environment is crucial.
                Standard office tools do not provide insights or suggestions on how to best tailor content for different
                audiences.
              </p>
            </li>
            <li>
              <p>
                <strong>Lack of Consistency and Persuasiveness</strong>: Ensuring consistency in messaging and
                persuasiveness across various proposal documents is difficult. Professionals might struggle to maintain
                a uniform tone and style that aligns with corporate branding and project objectives.
              </p>
            </li>
          </ul>
          <p>
            <em>
              In the absence of CraftFinal, creating project proposals in large corporate settings becomes a daunting
              task, often leading to inefficient processes and less impactful proposals.
            </em>
          </p>
        </CollapsibleContent>
      </Collapsible>

      <ul>
        <li>
          <strong>Template Customization</strong>: Users select templates designed for corporate project proposals.
        </li>
        <li>
          <strong>Integration of Corporate Data</strong>: <strong>CraftFinal</strong> integrates with corporate
          databases to pull relevant project data, statistics, and previous successful pitches.
        </li>
        <li>
          <strong>AI-Powered Recommendations</strong>: Offers suggestions on structuring the pitch to align with
          corporate goals and the specific project‘s needs, enhancing persuasion and clarity.
        </li>
      </ul>
      <p>
        <em>
          CraftFinal effectively bridges the gap between complex corporate data and clear, persuasive project proposals.
        </em>
      </p>

      <h4>
        3. <strong>Academic Research Grant Proposals</strong>
      </h4>
      <p>For academic professionals, crafting research grant proposals is a critical task.</p>

      <Collapsible
        open={isOpen["academia"]}
        onOpenChange={() => {
          toggleCollapsible("academia");
        }}
        className="flex flex-col space-y-2"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center justify-start gap-x-4 rounded-none p-6 text-lg xl:text-xl"
          >
            <ChevronsUpDown className="h-4 w-4" />
            <h5>The agony of academic research grant proposals</h5>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-muted-foreground/20 p-6">
          <p>
            Academic professionals who are tasked with drafting research grant proposals face distinct challenges when
            lacking specialized tools like CraftFinal:
          </p>
          <ul>
            <li>
              <p>
                <strong>Difficulty in Aligning with Grant Criteria</strong>: Academics often struggle to tailor their
                proposals to specific grant criteria using general word processing tools. These tools do not offer
                guidance or tailored templates for various grant applications.
              </p>
            </li>
            <li>
              <p>
                <strong>Integration of Relevant Research</strong>: Effectively integrating previous research findings,
                papers, and relevant literature into a new grant proposal is a complex task. Traditional tools do not
                facilitate this integration, making the process laborious and time-consuming.
              </p>
            </li>
            <li>
              <p>
                <strong>Inconsistent Structuring and Formatting</strong>: Maintaining a consistent structure and format
                that meets the stringent requirements of grant bodies is crucial. Without specialized tools, this can be
                challenging, potentially leading to overlooked opportunities or rejections.
              </p>
            </li>
            <li>
              <p>
                <strong>Limited Personalization for Specific Fields of Study</strong>: Each field of study has unique
                nuances and expectations in grant proposals. Standard tools lack the capacity to offer field-specific
                suggestions, which can hinder the effectiveness of the proposals.
              </p>
            </li>
          </ul>
          <p>
            <em>
              Without a tool like CraftFinal, academic professionals face significant hurdles in crafting compelling,
              well-structured, and criterion-aligned research grant proposals, potentially impacting the success of
              their funding applications.
            </em>
          </p>
        </CollapsibleContent>
      </Collapsible>

      <p>
        <strong>CraftFinal</strong> streamlines this process:
      </p>
      <ul>
        <li>
          <strong>Specialized Academic Templates</strong>: Providing templates that adhere to common academic and
          research grant structures.
        </li>
        <li>
          <strong>Research Integration</strong>: Enabling users to import previous research papers, grants, and relevant
          literature. <strong>CraftFinal</strong> then suggests content and structuring that align with grant
          requirements.
        </li>
        <li>
          <strong>Focused Suggestions</strong>: Tailoring recommendations to the specific field of study and grant
          criteria, ensuring proposals are compelling and meet the stringent requirements of academic funding bodies.
        </li>
      </ul>
      <p>
        <em>
          CraftFinal offers a tailored approach to academic professionals, enhancing the quality and effectiveness of
          their research grant proposals.
        </em>
      </p>
    </>
  );
}
