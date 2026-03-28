import React from "react";
import { twMerge } from "tailwind-merge";
import { stageToColor, stageToLabel } from "../../utils/helpers";

interface BadgeProps {
  stage?: number | string;
  label?: string;
  colorClass?: string;
  className?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  stage, 
  label, 
  colorClass, 
  className,
  showDot = true 
}) => {
  const displayLabel = label || (stage !== undefined ? stageToLabel(stage) : "Unknown");
  const displayColor = colorClass || (stage !== undefined ? stageToColor(stage) : "bg-gray-100 text-gray-800");

  return (
    <span className={twMerge(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
      displayColor,
      className
    )}>
      {showDot && (
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70 flex-shrink-0" />
      )}
      {displayLabel}
    </span>
  );
};
