import React from "react";
import { twMerge } from "tailwind-merge";
import { Spinner } from "./Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeMap = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantMap = {
    primary: "bg-primary text-white hover:bg-primary-light focus:ring-primary",
    secondary: "bg-accent text-accent-dark hover:bg-accent-light focus:ring-accent",
    outline: "border-2 border-primary text-primary hover:bg-surface focus:ring-primary",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-surface text-gray-700 focus:ring-gray-300",
  };

  return (
    <button
      className={twMerge(baseClasses, sizeMap[size], variantMap[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="mr-2" size="sm" color={variant === "outline" ? "primary" : "white"} />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};
