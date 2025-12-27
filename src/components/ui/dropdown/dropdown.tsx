"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowDownSm, ArrowUpSm } from "@/icons";
import { useTheme } from "@/hooks/use-theme";

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  image?: string;
  disabled?: boolean;
  disabledHint?: string;
  modelType?: 'high' | 'medium' | 'low';
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  modeText?: string;
  openUpward?: boolean;
  variant?: "default" | "model-selector";
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder,
  onChange,
  className = "",
  disabled = false,
  icon,
  modeText,
  openUpward = false,
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tooltipRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setHoveredOption(null);
  };

  const handleTooltipMouseEnter = (optionValue: string, event: React.MouseEvent<HTMLDivElement>) => {
    const tooltipElement = tooltipRefs.current.get(optionValue);
    if (tooltipElement) {
      const rect = tooltipElement.getBoundingClientRect();
      const tooltipWidth = 288; // w-72 = 18rem = 288px
      const tooltipHeight = 100; // approximate height
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let left = rect.right - tooltipWidth;
      let top = rect.top - tooltipHeight - 8;
      
      // Adjust if tooltip would go off screen
      if (left < 8) {
        left = rect.left;
      }
      if (left + tooltipWidth > viewportWidth - 8) {
        left = viewportWidth - tooltipWidth - 8;
      }
      if (top < 8) {
        top = rect.bottom + 8;
      }
      
      setTooltipPosition({ top, left });
      setHoveredOption(optionValue);
    }
  };

  const handleTooltipMouseLeave = () => {
    setHoveredOption(null);
    setTooltipPosition(null);
  };

  const getModelTypeColor = (modelType?: 'high' | 'medium' | 'low') => {
    if (!modelType) return '';
    switch (modelType) {
      case 'high':
        return {
          border: 'border-red-500',
          bg: 'bg-red-50 dark:bg-red-900/20',
          text: 'text-red-700 dark:text-red-400',
          badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
        };
      case 'medium':
        return {
          border: 'border-green-500',
          bg: 'bg-green-50 dark:bg-green-900/20',
          text: 'text-green-700 dark:text-green-400',
          badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
        };
      case 'low':
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          text: 'text-blue-700 dark:text-blue-400',
          badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
        };
      default:
        return {
          border: '',
          bg: '',
          text: '',
          badge: ''
        };
    }
  };

  const getModelTypeLabel = (modelType?: 'high' | 'medium' | 'low') => {
    if (!modelType) return '';
    switch (modelType) {
      case 'high':
        return 'High Cost';
      case 'medium':
        return 'Medium Cost';
      case 'low':
        return 'Low Cost';
      default:
        return '';
    }
  };

  const getButtonClasses = () => {
    if (variant === "model-selector") {
      const modelTypeColor = getModelTypeColor(selectedOption?.modelType);
      return `
        inline-flex items-center justify-between w-full 
        px-3 py-2
        border-2 ${modelTypeColor.border || 'border-transparent'}
        ${modelTypeColor.bg || 'bg-[color:var(--tokens-color-surface-surface-darkgray-50)]'}
        rounded-lg
        text-left cursor-pointer transition-all duration-200
        shadow-sm hover:shadow-md
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-opacity-80 hover:scale-[1.02] active:scale-[0.98]"
        }
      `;
    }

    return `
      inline-flex items-center justify-between w-full 
       rounded-[var(--premitives-corner-radius-corner-radius-2)]
      text-left cursor-pointer transition-colors duration-200
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-80"}
    `;
  };

  const getDropdownClasses = () => {
    const bgColor =
      variant === "model-selector"
        ? `${!isDark ? "bg-white" : "bg-tokens-color-surface-surface-dark" } `
        : "bg-[color:var(--tokens-color-surface-surface-button-pressed)]";
    const widthClass = variant === "model-selector" ? "w-full" : "left-0 ";
    const baseClasses = `absolute ${widthClass} mt-2 ${bgColor} border border-[color:var(--tokens-color-border-border-subtle)] rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto backdrop-blur-sm`;

    if (openUpward) {
      return `${baseClasses} bottom-full mb-2`;
    }

    return `${baseClasses} top-full`;
  };

  const getButtonContent = () => {
    if (variant === "model-selector") {
      const modelTypeColor = getModelTypeColor(selectedOption?.modelType);
      return (
        <div className="flex items-center gap-2.5 w-full">
          {selectedOption?.icon && (
            <div className="flex-shrink-0">{selectedOption.icon}</div>
          )}
          {selectedOption?.image && (
            <img
              src={selectedOption.image}
              alt={selectedOption.label}
              className="w-5 h-5 rounded flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="font-text-medium font-[number:var(--text-medium-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-sm tracking-[var(--text-medium-letter-spacing)] leading-[var(--text-medium-line-height)] truncate [font-style:var(--text-medium-font-style)]">
              {selectedOption?.label || placeholder}
            </span>
            {selectedOption?.modelType && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${modelTypeColor.badge} flex-shrink-0`}>
                {getModelTypeLabel(selectedOption.modelType)}
              </span>
            )}
          </div>
          {isOpen ? (
            <ArrowUpSm
              color="rgba(31, 23, 64, 0.9)"
              className="transition-transform duration-200 flex-shrink-0 w-4 h-4"
            />
          ) : (
            <ArrowDownSm
              color="rgba(31, 23, 64, 0.9)"
              className="transition-transform duration-200 flex-shrink-0 w-4 h-4"
            />
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {modeText && (
          <span className="font-h02-heading02 font-[number:var(--text-medium-font-weight)] text-tokens-color-text-text-neutral text-sm tracking-[var(--text-medium-letter-spacing)] leading-[var(--text-medium-line-height)] whitespace-nowrap [font-style:var(--text-medium-font-style)]">
            {modeText}
          </span>
        )}
        {selectedOption?.icon && (
          <div className="flex-shrink-0">{selectedOption.icon}</div>
        )}
        {selectedOption?.image && (
          <img
            src={selectedOption.image}
            alt={selectedOption.label}
            className="w-4 h-4 rounded flex-shrink-0"
          />
        )}
        <ArrowDownSm
          color="#FFFFFF"
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
        <span className="font-h02-heading02 font-[number:var(--text-medium-font-weight)] text-tokens-color-text-text-neutral text-sm tracking-[var(--text-medium-letter-spacing)] leading-[var(--text-medium-line-height)] whitespace-nowrap [font-style:var(--text-medium-font-style)]">
          {selectedOption?.label || placeholder}
        </span>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={getButtonClasses()}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {getButtonContent()}
      </button>

      {isOpen && (
        <>
          <div className={getDropdownClasses()}>
            {options.map((option) => {
              const isDisabled = option.disabled || false;
              const optionModelTypeColor = variant === "model-selector" ? getModelTypeColor(option.modelType) : { border: '', bg: '', text: '', badge: '' };
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  className="relative"
                >
                  <button
                    type="button"
                    className={`
                      w-full px-4 py-3 text-left flex items-center gap-3 
                      transition-all duration-200
                      ${variant === "model-selector" && optionModelTypeColor.border ? `border-l-4 ${optionModelTypeColor.border}` : ''}
                      ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : `hover:bg-[color:var(--tokens-color-surface-surface-secondary)] cursor-pointer hover:translate-x-1 ${optionModelTypeColor.bg ? `hover:${optionModelTypeColor.bg}` : ''}`
                      }
                      ${
                        isSelected
                          ? `bg-[color:var(--tokens-color-surface-surface-secondary)] ${optionModelTypeColor.bg || ''}`
                          : ""
                      }
                      ${variant === "model-selector" ? "rounded-r-lg" : ""}
                    `}
                    onClick={() => !isDisabled && handleOptionClick(option.value)}
                    disabled={isDisabled}
                  >
                    {option.icon && (
                      <div className="flex-shrink-0">{option.icon}</div>
                    )}
                    {option.image && (
                      <img
                        src={option.image}
                        alt={option.label}
                        className="w-5 h-5 rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span
                        className={`font-h02-heading02 font-[number:var(--text-small-font-weight)] text-sm tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] truncate [font-style:var(--text-small-font-style)] ${
                          variant === "model-selector"
                            ? "text-[color:var(--tokens-color-text-text-brand)]"
                            : "text-[color:var(--tokens-color-text-text-neutral)]"
                        }`}
                      >
                        {option.label}
                      </span>
                      {option.modelType && variant === "model-selector" && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${optionModelTypeColor.badge} flex-shrink-0`}>
                          {getModelTypeLabel(option.modelType)}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-[color:var(--tokens-color-text-text-brand)]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    {isDisabled && option.disabledHint && (
                      <div
                        ref={(el) => {
                          if (el) {
                            tooltipRefs.current.set(option.value, el);
                          } else {
                            tooltipRefs.current.delete(option.value);
                          }
                        }}
                        className="ml-auto flex-shrink-0"
                        onMouseEnter={(e) => handleTooltipMouseEnter(option.value, e)}
                        onMouseLeave={handleTooltipMouseLeave}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-tokens-color-text-text-muted hover:text-tokens-color-text-text-primary transition-colors cursor-help"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
          {hoveredOption && tooltipPosition && typeof document !== 'undefined' && (() => {
            const option = options.find(opt => opt.value === hoveredOption);
            if (!option?.disabledHint) return null;
            
            return createPortal(
              <div
                className="fixed w-72 p-3 bg-tokens-color-surface-surface-dark border border-tokens-color-border-border-subtle text-tokens-color-text-text-neutral text-sm rounded-lg shadow-2xl z-[200] whitespace-normal"
                style={{
                  top: `${tooltipPosition.top}px`,
                  left: `${tooltipPosition.left}px`,
                }}
                onMouseEnter={() => setHoveredOption(hoveredOption)}
                onMouseLeave={handleTooltipMouseLeave}
              >
                <div className="font-semibold mb-1.5 text-tokens-color-text-text-primary text-base">Model Unavailable</div>
                <div className="text-tokens-color-text-text-secondary leading-relaxed">{option.disabledHint}</div>
                <div className="absolute top-full right-4 mt-0 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-tokens-color-surface-surface-dark"></div>
              </div>,
              document.body
            );
          })()}
        </>
      )}
    </div>
  );
};
