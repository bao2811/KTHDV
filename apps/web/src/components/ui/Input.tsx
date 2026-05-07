import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export default function Input({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      ) }
      <div className="relative group">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full ${icon ? "pl-10" : "px-4"} pr-4 py-3 bg-surface-container-low border ${error ? "border-error" : "border-outline-variant"} rounded-xl text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-outline`}
          {...props}
        />
      </div>
      {error && <span className="text-[11px] text-error font-medium">{error}</span>}
    </div>
  );
}
