import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "error";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container shadow-sm",
    secondary: "bg-secondary text-white hover:bg-secondary-container shadow-sm",
    outline: "bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-low",
    ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-low",
    error: "bg-error text-white hover:opacity-90 shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-6 py-2.5 text-sm rounded-lg",
    lg: "px-8 py-4 text-base rounded-xl",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="material-symbols-outlined animate-spin mr-2 text-[18px]">refresh</span>
          Đang xử lý...
        </>
      ) : (
        children
      )}
    </button>
  );
}
