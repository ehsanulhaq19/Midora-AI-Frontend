"use client";

import React, { useState } from "react";
import { CaretDown, ArrowRightSm, DownArrow } from "@/icons";

export const LanguageSection: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("auto-detect");
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { value: "auto-detect", label: "Auto Detect" },
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-9">
      <div className="flex flex-col mt-9 bg-[color:var(--account-section-card-bg)] gap-6 p-6 sm:p-9 rounded-[16px] border">
        <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[-1px] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
          Languages
        </h1>

        {/* Language preference section - 24px gap from title */}
        <div className="flex flex-col gap-4">
          <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            Language preference
          </label>

          {/* Dropdown field - 16px gap from label */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={handleChange}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              className={`flex h-[54px] items-center gap-3 px-6 py-3 pr-12 rounded-xl border bg-transparent transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-2 outline-none font-SF-Pro font-normal text-base tracking-[-0.48px] leading-[100%] appearance-none w-full cursor-pointer ${
                selectedLanguage === "auto-detect"
                  ? "text-[color:var(--tokens-color-text-text-inactive-2)]"
                  : "text-[color:var(--tokens-color-text-text-primary)]"
              } ${
                isOpen
                  ? "border-[color:var(--tokens-color-text-text-seconary)]"
                  : "border-[#dbdbdb]"
              }`}
            >
              {languages.map((lang) => (
                <option
                  key={lang.value}
                  value={lang.value}
                  className={
                    lang.value === "auto-detect"
                      ? "text-[color:var(--tokens-color-text-text-inactive-2)]"
                      : "text-black"
                  }
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
