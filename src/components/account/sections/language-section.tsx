"use client";

import React, { useState } from "react";
import { CaretDown, ArrowRightSm, DownArrow } from "@/icons";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage, useTranslation } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { LANGUAGES, getLanguageNameFromCode } from "@/lib/language-constants";

interface LanguageSectionProps {
  onLoadingChange?: ((isLoading: boolean) => void) | undefined;
}

export const LanguageSection: React.FC<LanguageSectionProps> = ({ onLoadingChange }) => {
  const { setLanguage, loadLanguageFromUser } = useLanguage();
  const { t, language } = useTranslation();
  const { updateProfile, getCurrentUser } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguageCode = e.target.value as 'en' | 'zh' | 'de' | 'ar';
    const previousLanguage = language;
    
    // Get the full language name for the selected code
    const fullLanguageName = getLanguageNameFromCode(newLanguageCode);
    
    // Update local language immediately for better UX
    setLanguage(newLanguageCode);
    setIsOpen(false);
    
    // Update language in backend with full language name
    try {
      setIsUpdating(true);
      onLoadingChange?.(true);
      await updateProfile({ language: fullLanguageName });
      
      // Refresh user data to get updated language
      const userData = await getCurrentUser();
      
      // Load language from updated user data
      if (userData?.language) {
        loadLanguageFromUser(userData.language);
      }
      
      // Force page refresh to apply language changes
      router.refresh();
      
      // Keep loader visible for smooth transition - wait for refresh to complete
      // This prevents UI jerk by ensuring loader stays until new content is ready
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to update language:', error);
      // Revert to previous language on error
      setLanguage(previousLanguage);
    } finally {
      setIsUpdating(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-9">
      <div className={`flex flex-col mt-9  gap-6 p-6 sm:p-9 rounded-[16px] ${isDark ? 'bg-[color:var(--tokens-color-surface-surface-card-hover)]' : 'border bg-[color:var(--account-section-card-bg)]'} `}>
        <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[-1px] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
          {t("account.language.title")}
        </h1>

        {/* Language preference section - 24px gap from title */}
        <div className="flex flex-col gap-4">
          <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            {t("account.language.languagePreference")}
          </label>

          {/* Dropdown field - 16px gap from label */}
          <div className="relative">
            <select
              value={language}
              onChange={handleChange}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              disabled={isUpdating}
              className={`flex h-[54px] items-center gap-3 px-6 py-3 pr-12 rounded-xl border bg-transparent transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-2 outline-none font-SF-Pro font-normal text-base tracking-[-0.48px] leading-[100%] appearance-none w-full cursor-pointer text-[color:var(--tokens-color-text-text-primary)] ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                borderColor: isOpen
                  ? 'var(--tokens-color-text-text-seconary)'
                  : isDark
                    ? 'var(--tokens-color-border-border-inactive)'
                    : '#dbdbdb',
                backgroundColor: isDark ? 'var(--tokens-color-surface-surface-card-default)' : undefined
              }}
            >
              {LANGUAGES.map((lang) => (
                <option
                  key={lang.value}
                  value={lang.value}
                  className="text-black"
                  style={{
                    color: 'var(--tokens-color-text-text-primary)'
                  }}
                >
                  {lang.label}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200">
              <DownArrow
                className={` transition-transform flex-shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
