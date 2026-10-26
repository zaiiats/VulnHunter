import React from "react";

export type ButtonVariant = "primary" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType | string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  withDiamond?: boolean;
  fullWidth?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-hover text-white shadow-[0_0_10px_rgba(236,78,32,0.1)] hover:shadow-[0_0_15px_rgba(255,149,5,0.2)]",
  outline:
    "border border-muted bg-transparent text-gray-400 hover:bg-muted hover:text-foreground",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "py-1.5 px-3 text-[10px]",
  md: "py-2.5 px-4 text-xs",
  lg: "py-3 px-6 text-sm",
};

export const Button = ({
  as: Component = "button",
  variant = "primary",
  size = "md",
  withArrow = false,
  withDiamond = false,
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "group font-bold uppercase tracking-wider rounded-md transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const layoutStyles = fullWidth ? "w-full" : "w-fit";
  const alignmentStyles =
    fullWidth && withArrow ? "justify-between" : "justify-center gap-2";

  const combinedClasses = [
    baseStyles,
    layoutStyles,
    alignmentStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={combinedClasses} {...props}>
      {withDiamond && (
        <>
          <span className="text-lg inline-block group-hover:hidden leading-none font-normal">
            ◇
          </span>
          <span className="text-lg hidden group-hover:inline-block leading-none font-normal">
            ◆
          </span>
        </>
      )}

      <span>{children}</span>

      {withArrow && (
        <span className="transition-transform group-hover:translate-x-1 text-lg leading-none font-normal">
          »
        </span>
      )}
    </Component>
  );
};
