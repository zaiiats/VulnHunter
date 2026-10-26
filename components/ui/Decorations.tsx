import React from "react";
import { Text } from "@/components/ui/Text";
import Link from "next/link";

export type DividerSpacing = "none" | "sm" | "md" | "lg";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  spacing?: DividerSpacing;
}

const spacingStyles: Record<DividerSpacing, string> = {
  none: "my-0",
  sm: "my-3",
  md: "my-4",
  lg: "my-8",
};

export const Divider = ({
  text,
  spacing = "md",
  className = "",
  ...props
}: DividerProps) => {
  const appliedSpacing = spacingStyles[spacing];

  if (!text) {
    return (
      <div
        className={`w-full border-t border-muted ${appliedSpacing} ${className}`}
        {...props}
      />
    );
  }

  return (
    <div
      className={`border-t border-muted relative w-full ${appliedSpacing} ${className}`}
      {...props}
    >
      <Text
        as="span"
        variant="mono-label"
        className="absolute text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3"
      >
        {text}
      </Text>
    </div>
  );
};

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  subtitlePosition?: "bottom" | "right";
  backLink?: { text: string; href: string };
  rightContent?: React.ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  subtitlePosition = "bottom",
  backLink,
  rightContent,
  className = "",
  ...props
}: PageHeaderProps) => {
  return (
    <div className={`w-full mb-8 ${className}`} {...props}>
      {backLink && (
        <div className="mb-6">
          <Text
            as={Link}
            href={backLink.href}
            variant="mono-label"
            size="xs"
            color="gray-400"
            className="inline-flex items-center gap-2 hover:text-primary transition-colors"
          >
            - {backLink.text}
          </Text>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-muted pb-4 gap-4">
        <div className="flex flex-col">
          <Text as="h1" variant="section" size="2xl" className="block">
            {title}
          </Text>

          {subtitle && subtitlePosition === "bottom" && (
            <Text variant="mono-code" color="primary" className="mt-1.5 block">
              [ {subtitle} ]
            </Text>
          )}
        </div>

        {(rightContent || (subtitle && subtitlePosition === "right")) && (
          <div className="flex items-center gap-4">
            {rightContent && <div>{rightContent}</div>}

            {subtitle && subtitlePosition === "right" && (
              <Text variant="mono-label">[ {subtitle} ]</Text>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
