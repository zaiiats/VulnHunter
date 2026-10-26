import React, { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const baseInputClasses =
      "w-full px-3 py-2.5 bg-background border rounded-md text-foreground placeholder-gray-600 focus:outline-none focus:ring-1 disabled:opacity-50 transition-colors";

    const stateClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-muted focus:border-accent focus:ring-accent";

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono font-medium text-gray-400 uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`${baseInputClasses} ${stateClasses} ${className}`}
          {...props}
        />

        {error && (
          <p className="text-xs text-red-500 font-mono mt-1">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
