"use client";

import Image from "next/image";
import LogoImage from "@/public/logo.png";

export default function Logo({ size = 30 }: { size?: number }) {
  return (
    <Image
      src={LogoImage}
      width={size}
      height={size}
      alt="Vulnerability Hunter Logo"
      priority
    />
  );
}
