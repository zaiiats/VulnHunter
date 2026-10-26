import React from "react";

export type TextVariant =
  | "hero"
  | "title"
  | "section"
  | "subtitle"
  | "mono-code"
  | "mono-label"
  | "body"
  | "muted"
  | "pulse"
  | "nav-link";

export type TextSize =
  | "xs"
  | "sm"
  | "md"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "5xl"
  | "7xl"
  | "10px";
export type TextWeight = "normal" | "medium" | "semibold" | "bold" | "black";
export type TextColor =
  | "foreground"
  | "primary"
  | "accent"
  | "muted"
  | "white"
  | "gray-400"
  | "gray-300"
  | "gray-500"
  | "gray-600"
  | "green-500";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType | string;
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  uppercase?: boolean;
  tracking?: "normal" | "wide" | "wider" | "widest" | "tighter";
  href?: string;
  children: React.ReactNode;
}

const variantStyles: Record<TextVariant, string> = {
  hero: "font-black uppercase tracking-tighter",
  title: "font-mono font-black tracking-tight",
  section: "font-bold uppercase tracking-wide",
  subtitle: "font-mono font-bold uppercase tracking-wider",
  "mono-code": "font-mono uppercase tracking-[0.2em] leading-none",
  "mono-label": "font-mono uppercase tracking-widest",
  body: "font-mono leading-relaxed",
  muted: "font-mono uppercase tracking-widest",
  pulse: "font-mono uppercase animate-pulse",
  "nav-link":
    "px-3 py-1.5 hover:bg-muted/50 rounded transition-colors font-mono cursor-pointer flex items-center hover:text-foreground",
};

const variantDefaultColors: Record<TextVariant, string> = {
  hero: "text-foreground",
  title: "text-foreground",
  section: "text-foreground",
  subtitle: "text-primary",
  "mono-code": "text-accent",
  "mono-label": "text-gray-500",
  body: "text-gray-400",
  muted: "text-gray-600",
  pulse: "text-primary",
  "nav-link": "text-gray-400",
};

const variantDefaultSizes: Record<TextVariant, string> = {
  hero: "",
  title: "",
  section: "",
  subtitle: "text-sm",
  "mono-code": "text-[10px]",
  "mono-label": "text-[10px]",
  body: "text-sm",
  muted: "text-[10px]",
  pulse: "",
  "nav-link": "text-xs",
};

const sizeStyles: Record<TextSize, string> = {
  "10px": "text-[10px]",
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "5xl": "text-5xl md:text-6xl",
  "7xl": "text-5xl md:text-7xl",
};

const weightStyles: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  black: "font-black",
};

const colorStyles: Record<TextColor, string> = {
  foreground: "text-foreground",
  primary: "text-primary",
  accent: "text-accent",
  muted: "text-muted",
  white: "text-white",
  "gray-400": "text-gray-400",
  "gray-300": "text-gray-300",
  "gray-500": "text-gray-500",
  "gray-600": "text-gray-600",
  "green-500": "text-green-500",
};

const trackingStyles = {
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
  tighter: "tracking-tighter",
};

export const Text = ({
  as: Component = "span",
  variant,
  size,
  weight,
  color,
  uppercase,
  tracking,
  className = "",
  children,
  ...props
}: TextProps) => {
  const appliedVariant = variant ? variantStyles[variant] : "";

  const appliedColor = color
    ? colorStyles[color]
    : variant
      ? variantDefaultColors[variant]
      : "";

  const appliedSize = size
    ? sizeStyles[size]
    : variant
      ? variantDefaultSizes[variant]
      : "";

  const combinedClasses = [
    appliedVariant,
    appliedColor,
    appliedSize,
    weight ? weightStyles[weight] : "",
    uppercase !== undefined ? (uppercase ? "uppercase" : "normal-case") : "",
    tracking ? trackingStyles[tracking] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
};
