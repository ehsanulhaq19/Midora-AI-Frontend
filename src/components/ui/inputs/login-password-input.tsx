"use client";

import React, { useState } from "react";

interface LoginPasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const LoginPasswordInput: React.FC<LoginPasswordInputProps> = ({
  value,
  onChange,
  onKeyDown,
  error,
  disabled = false,
  placeholder = "Enter your password",
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`flex h-[54px] items-center gap-3  relative self-stretch w-full rounded-xl border border-solid transition-all duration-200 focus-within:ring-offset-2 ${
        error
          ? "border-red-500 focus-within:ring-red-500"
          : "border-[#dbdbdb] focus-within:ring-blue-500"
      } ${className}`}
    >
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="relative w-full font-body-primary font-normal text-black text-base tracking-[-0.48px] leading-[normal] bg-transparent border-none outline-none placeholder:[color:var(--tokens-color-text-text-inactive-2)] pl-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Password"
        required
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        disabled={disabled}
        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};
