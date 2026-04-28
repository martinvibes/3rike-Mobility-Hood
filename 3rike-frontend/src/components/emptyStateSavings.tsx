import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string | ReactNode; // Allows strings or JSX (like Links)
  icon?: string;
  className?: string;
}

export default function EmptyState({
  title = "Nothing to see",
  description = "There is currently no data to display.",
  icon = "/fail.svg", // You might want to change this default image for empty lists
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-500 mx-auto py-8 ${className}`}>
      
      {/* --- ICON --- */}
      <div className="relative mb-2">
        <img src={icon} alt="status icon" className="w-20 h-20" />
      </div>

      {/* --- TEXT CONTENT --- */}
      <h1 className="text-xl font-extrabold text-gray-900 mb-3">
        {title}
      </h1>

      <div className="text-gray-500 leading-relaxed text-sm md:text-base max-w-70">
        {description}
      </div>
    </div>
  );
}