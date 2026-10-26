import Nav from "@/components/Nav";
import { ReactNode } from "react";

export default function NavLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
}
