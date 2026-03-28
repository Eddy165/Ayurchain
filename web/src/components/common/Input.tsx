import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, iconLeft, iconRight, className, id, ...props }, ref) => {
    const defaultId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={defaultId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {iconLeft}
            </div>
          )}
          <input
            id={defaultId}
            ref={ref}
            className={twMerge(
              "block w-full rounded-md border-gray-300 shadow-sm sm:text-sm transition-colors",
              "focus:border-primary focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500",
              error ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" : "",
              iconLeft ? "pl-10" : "",
              iconRight ? "pr-10" : "",
              "border px-3 py-2",
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {iconRight}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={twMerge("mt-1 text-sm", error ? "text-red-600" : "text-gray-500")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
