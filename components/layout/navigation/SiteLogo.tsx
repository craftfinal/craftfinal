import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
}
const SiteLogo = ({ width, height }: LogoProps) => {
  const logoWidth = width ?? 96;
  const logoHeight = height ?? width ?? 96;
  return (
    <div>
      <Image src="/images/logo.svg" width={logoWidth} height={logoHeight} alt="logo" />
    </div>
  );
};

export default SiteLogo;
