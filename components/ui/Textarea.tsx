// components/ui/Textarea.tsx
import React, { forwardRef, useId } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    const baseClasses =
      "w-full px-3 py-2.5 bg-background border rounded-md text-foreground placeholder-gray-600 focus:outline-none focus:ring-1 disabled:opacity-50 transition-colors resize-y";

    const stateClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-muted focus:border-accent focus:ring-accent";

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-mono font-medium text-gray-400 uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={`${baseClasses} ${stateClasses} ${className}`}
          {...props}
        />

        {error && (
          <p className="text-xs text-red-500 font-mono mt-1">{error}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
