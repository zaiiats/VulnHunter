import React from "react";
import Link from "next/link";
import { Text } from "@/components/ui/Text";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType | string;
  href?: string;
  title?: string;
  action?: React.ReactNode;
  footerLink?: { text: string; href: string };
  noPadding?: boolean;
  children: React.ReactNode;
}

export const Card = ({
  as: Component = "div",
  title,
  action,
  footerLink,
  noPadding = false,
  className = "",
  children,
  href,
  ...props
}: CardProps) => {
  const isInteractive = Component === Link || Component === "a" || href;

  const baseClasses =
    "bg-card border border-muted rounded-md flex flex-col h-full shadow-sm overflow-hidden";

  const interactiveClasses = isInteractive
    ? "group transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(236,78,32,0.1)] block"
    : "";

  const combinedClasses = [baseClasses, interactiveClasses, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={combinedClasses} href={href} {...props}>
      {(title || action) && (
        <div className="p-4 border-b border-muted flex justify-between items-center bg-muted/10">
          {title ? (
            <Text as="h2" variant="section" size="sm" tracking="wider">
              {title}
            </Text>
          ) : (
            <div />
          )}
          {action && <div>{action}</div>}
        </div>
      )}

      <div className={`flex flex-col flex-1 ${noPadding ? "" : "p-6"}`}>
        {children}
      </div>

      {footerLink && (
        <Link
          href={footerLink.href}
          className="mt-auto p-3 border-t border-muted bg-muted/5 hover:bg-muted/20 transition-colors group/footer flex items-center justify-center gap-2"
        >
          <Text
            as="span"
            variant="mono-label"
            color="gray-400"
            className="group-hover/footer:text-primary transition-colors"
          >
            {footerLink.text}
          </Text>
          <Text
            as="span"
            color="gray-500"
            className="group-hover/footer:translate-x-1 group-hover/footer:text-primary transition-all font-mono"
          >
            »
          </Text>
        </Link>
      )}
    </Component>
  );
};
