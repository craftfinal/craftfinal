// @/layouts/mdx/ArticleMDX.tsx

import WrapMDX, { WrapMDXProps } from "./WrapMDX";

export default async function ArticleMDX({ children, ...props }: Readonly<WrapMDXProps>) {
  return (
    <WrapMDX as="article" {...props}>
      {children}
    </WrapMDX>
  );
}
