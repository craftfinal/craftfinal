// @/app/(marketing)/(home)/DistinguishingFeatures.tsx

export default async function DistinguishingFeatures() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
      <div className="mb-8 max-w-screen-md lg:mb-16">
        <h2 className="mb-8 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white md:text-4xl lg:mb-16">
          How is CraftFinal different from ChatGPT, Notion.ai and Microsoft Office?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 sm:text-xl">
          It lets you avoid <span className="font-bold text-foreground">repeating yourself.</span>
        </p>
      </div>
      <div className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
        <div>
          <div className="bg-primary-100 dark:bg-primary-900 mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12">
            <svg
              className="text-primary-600 dark:text-primary-300 h-5 w-5 lg:h-6 lg:w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold dark:text-white">Guard rails</h3>
          <p className="text-gray-500 dark:text-gray-400">
            At the core of the iteration process of CraftFinal lies a template that is derived from your existing
            documents, the targeted Request for Proposal (RFP), job description or other format specification. This
            avoids any deviation outside the guardrails of the template.
          </p>
        </div>
        <div>
          <div className="bg-primary-100 dark:bg-primary-900 mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12">
            <svg
              className="text-primary-600 dark:text-primary-300 h-5 w-5 lg:h-6 lg:w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold dark:text-white">Complete history</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Every iteration of every document is available as a source not only of inspiration or to use for manual
            copy-and-paste. Instead, you can drag-and-drop any piece of content to the current version of your document
            directly.
          </p>
        </div>
        <div>
          <div className="bg-primary-100 dark:bg-primary-900 mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12">
            <svg
              className="text-primary-600 dark:text-primary-300 h-5 w-5 lg:h-6 lg:w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold dark:text-white">Control</h3>
          <p className="text-gray-500 dark:text-gray-400">
            You have complete control over every piece of your document. New versions only change where you indicate
            that change is desirable.
          </p>
        </div>
      </div>
    </div>
  );
}
