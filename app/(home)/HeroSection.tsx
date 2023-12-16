// @/app/(marketing)/(home)/HeroSection.tsx

import EnterPlaygroundButton from "@/components/chrome/buttons/ToPlaygroundButton";
import { ContentLayoutChildrenProps } from "../../layouts/ContentLayout";

import Image from "next/image";

import meanderingRoad from "./(assets)/pexels-eberhard-grossgasteiger-1612462.jpg";

export interface HeroSectionProps extends ContentLayoutChildrenProps {}
export default async function HeroSection({ account }: HeroSectionProps) {
  return (
    <div className="grid max-w-screen-xl py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
      <div className="mr-auto place-self-center lg:col-span-7">
        <div className="text-gradient flex bg-gradient-to-r from-green-800 to-indigo-900 bg-clip-text pb-4 text-4xl font-bold text-transparent dark:from-blue-500 dark:to-slate-400 sm:text-6xl lg:text-8xl">
          Déjà vu
        </div>
        <p className="mb-6 max-w-2xl text-xl font-bold text-muted-foreground md:text-2xl lg:mb-8 lg:text-4xl">
          Have you ever felt like you were iterating on a document forever?
        </p>
        <h1 className="mb-4 flex flex-wrap items-baseline gap-4 text-2xl font-bold dark:text-white md:text-4xl xl:mb-8 xl:text-5xl">
          <EnterPlaygroundButton account={account} />
          <div className="mt-4 text-xl font-normal md:text-2xl lg:text-4xl">
            {" "}
            to see, how CraftFinal helps creating the final version
          </div>
        </h1>
        {/* <a
          href="#"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        >
          Speak to Sales
        </a> */}
      </div>
      <div className="hidden lg:col-span-5 lg:mt-0 lg:flex">
        <Image src={meanderingRoad} alt="Meandering road in Maloja GR, Switzerland" width={2000} height={3000} />
        {/* Photo by eberhard grossgasteiger: https://www.pexels.com/photo/aerial-photography-of-zig-zag-road-1612462/ */}
      </div>
    </div>
  );
}
