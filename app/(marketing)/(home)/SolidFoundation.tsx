// @/app/(marketing)/(home)/SolidFoundation.tsx

import Image from "next/image";

export default async function SolidFoundation() {
  return (
    <div className="mx-auto max-w-screen-xl items-center gap-16 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16">
      <div className="font-light text-gray-500 dark:text-gray-400 sm:text-lg">
        <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">We didn’t reinvent the wheel</h2>
        <p className="mb-4">
          We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and
          quick, but big enough to deliver the scope you want at the pace you need. Small enough to be simple and quick,
          but big enough to deliver the scope you want at the pace you need.
        </p>
        <p>
          We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and
          quick.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Image
          className="w-full rounded-lg"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
          alt="office content 1"
        />
        <Image
          className="mt-4 w-full rounded-lg lg:mt-10"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
          alt="office content 2"
        />
      </div>
    </div>
  );
}
