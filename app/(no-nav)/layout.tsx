import Logo from "@/components/Logo";
import Link from "next/link";
import { ReactNode } from "react";

export default function NoNavLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-dvh flex flex-col">
      <div className="relative flex items-center justify-center p-10 z-10">
        <Link href="/">
          <Logo size={100} />
        </Link>
      </div>
      <div className="flex items-center justify-center -mt-20 flex-1">
        {children}
      </div>
    </div>
  );
}
