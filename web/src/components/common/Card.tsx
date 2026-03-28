import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  children, 
  footer, 
  action, 
  className 
}) => {
  return (
    <div className={twMerge("bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col", className)}>
      {(title || action) && (
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {action && <div className="ml-4 flex-shrink-0">{action}</div>}
        </div>
      )}
      
      <div className="p-6 flex-grow">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 mt-auto">
          {footer}
        </div>
      )}
    </div>
  );
};
