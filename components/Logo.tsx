import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  height?: number;
}

export default function Logo({ className = "", height = 44 }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/images/hero/logo-1.png"
        alt="Bonique"
        width={Math.round(height * 1.2)}
        height={height}
        className="h-auto w-auto object-contain"
        style={{ height, width: "auto" }}
        priority
      />
    </Link>
  );
}
