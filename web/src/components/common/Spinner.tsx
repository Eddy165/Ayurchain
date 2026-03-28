import React from "react";
import { twMerge } from "tailwind-merge";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = "md", 
  color = "primary", 
  className 
}) => {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colorMap = {
    primary: "border-primary border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-300 border-t-gray-600",
  };

  return (
    <div className={twMerge("flex justify-center items-center", className)}>
      <div
        className={twMerge(
          "animate-spin rounded-full",
          sizeMap[size],
          colorMap[color]
        )}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};
