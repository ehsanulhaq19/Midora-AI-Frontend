"use client";

import React, { useState } from "react";
import { PersonFace, ArrowRightSm, DownArrow } from "@/icons";
import { useTheme } from "@/hooks/use-theme";

export const ProfileSection: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [formData, setFormData] = useState({
    fullName: "",
    displayName: "",
    workFunction: "",
  });

  const [selectedPreferences, setSelectedPreferences] = useState<number[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePreference = (index: number) => {
    setSelectedPreferences((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const preferences = [
    { id: 1, text: "Describe a forest at sunrise", source: "Midora AI" },
    { id: 2, text: "Describe a forest at sunrise", source: "Midora AI" },
    { id: 3, text: "Describe a forest at sunrise", source: "Midora AI" },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-9">
      <div className={`flex flex-col mt-9 bg-[color:var(--account-section-card-bg)] gap-6 p-6 sm:p-9 rounded-[16px] ${isDark ? 'bg-[color:var(--tokens-color-surface-surface-card-hover)]' : 'border'} `}
      >
        <h1 className="text-emphasis !text-[20px] text-[var(--tokens-color-text-text-seconary)]">
          Profile
        </h1>

        {/* Profile Picture and Name Fields */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Profile Picture */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-xl bg-[color:var(--tokens-color-surface-surface-tertiary)] flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                <PersonFace className="w-12 h-12" />
              </div>
            </div>
          </div>
          {/* Name Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] [font-style:var(--text-large-font-style)]">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`flex h-[54px] items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-2 outline-none font-SF-Pro font-normal text-base tracking-[-0.48px] leading-[100%] ${
                  isDark ? '' : 'border-[#dbdbdb] bg-transparent text-black'
                }`}
                style={isDark ? {
                  borderColor: 'var(--tokens-color-border-border-inactive)',
                  backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                  color: 'var(--tokens-color-text-text-primary)'
                } : {}}
              />
            </div>

            {/* What midora call you */}
            <div className="flex flex-col gap-2">
              <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                What midora call you
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Enter what midora call you"
                className={`flex h-[54px] items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-2 outline-none font-SF-Pro font-normal text-base tracking-[-0.48px] leading-[100%] ${
                  isDark ? '' : 'border-[#dbdbdb] bg-transparent text-black'
                }`}
                style={isDark ? {
                  borderColor: 'var(--tokens-color-border-border-inactive)',
                  backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                  color: 'var(--tokens-color-text-text-primary)'
                } : {}}
              />
            </div>
          </div>
        </div>

        {/* Your work function */}
        <div className="flex flex-col gap-2">
          <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            Your work function
          </label>
          <input
            type="text"
            name="workFunction"
            value={formData.workFunction}
            onChange={handleChange}
            placeholder="Enter your work function"
            className={`flex h-[54px] items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-seconary)] focus:ring-offset-2 outline-none font-SF-Pro font-normal text-base tracking-[-0.48px] leading-[100%] ${
              isDark ? '' : 'border-[#dbdbdb] bg-transparent text-black'
            }`}
            style={isDark ? {
              borderColor: 'var(--tokens-color-border-border-inactive)',
              backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
              color: 'var(--tokens-color-text-text-primary)'
            } : {}}
          />
        </div>

        {/* Choose your preference */}
        <div className="flex flex-col gap-4">
          <h2 className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            Choose your preference
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preferences.slice(0, 2).map((pref, index) => (
              <div
                key={pref.id}
                onClick={() => togglePreference(index)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPreferences.includes(index)
                    ? isDark 
                      ? "border-[color:var(--premitives-color-brand-purple-1000)]"
                      : "bg-[color:var(--tokens-color-surface-surface-button-pressed)] border-[color:var(--premitives-color-text-text-seconary)]"
                    : isDark
                      ? "border-[color:var(--tokens-color-border-border-inactive)]"
                      : "bg-[color:var(--account-section-card-bg)] border-[color:var(--tokens-color-border-border-subtle)] hover:border-[color:var(--tokens-color-border-border-active)]"
                }`}
                style={isDark && !selectedPreferences.includes(index) ? {
                  backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                } : isDark && selectedPreferences.includes(index) ? {
                  backgroundColor: 'var(--tokens-color-surface-surface-card-hover)'
                } : {}}
              >
                <div className="flex items-start justify-between mb-3">
                  <p
                    className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] ${
                      selectedPreferences.includes(index)
                        ? "text-white"
                        : "text-[color:var(--tokens-color-text-text-primary)]"
                    }`}
                  >
                    {pref.text}
                  </p>
                  <button 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDark ? '' : 'bg-[color:var(--tokens-color-text-text-brand)]'
                    }`}
                    style={isDark ? {
                      backgroundColor: 'var(--tokens-color-surface-surface-card-hover)',
                      border: '1px solid var(--tokens-color-border-border-subtle)'
                    } : {}}
                  >
                    <ArrowRightSm className="w-4 h-4 text-white rotate-[-90deg]" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] ${
                      selectedPreferences.includes(index)
                        ? "text-white/80"
                        : "text-[color:var(--tokens-color-text-text-primary)]"
                    }`}
                  >
                    {pref.source}
                  </span>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={isDark && selectedPreferences.includes(index) ? {
                      backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                      color: 'var(--tokens-color-text-text-primary)'
                    } : {
                      backgroundColor: selectedPreferences.includes(index) 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'var(--tokens-color-surface-surface-tertiary)',
                      color: selectedPreferences.includes(index) 
                        ? 'white' 
                        : 'var(--tokens-color-text-text-primary)'
                    }}
                  >
                    <span className="text-sm">Choose Style</span>
                    <DownArrow
                      className={` transition-transform flex-shrink-0 rotate-180`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Third card - full width */}
          <div
            onClick={() => togglePreference(2)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPreferences.includes(2)
                ? isDark
                  ? "border-[color:var(--premitives-color-brand-purple-1000)]"
                  : "bg-[color:var(--tokens-color-surface-surface-button-pressed)] border-[color:var(--premitives-color-brand-purple-1000)]"
                : isDark
                  ? "border-[color:var(--tokens-color-border-border-inactive)]"
                  : "bg-[color:var(--account-section-card-bg)] border-gray-200 hover:border-purple-300"
            }`}
            style={isDark && !selectedPreferences.includes(2) ? {
              backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
            } : isDark && selectedPreferences.includes(2) ? {
              backgroundColor: 'var(--tokens-color-surface-surface-card-hover)'
            } : {}}
          >
            <div className="flex items-start justify-between mb-3">
              <p
                className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] ${
                  selectedPreferences.includes(2)
                    ? "text-white"
                    : "text-[color:var(--tokens-color-text-text-primary)]"
                }`}
              >
                {preferences[2].text}
              </p>
              <button 
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDark ? '' : 'bg-[color:var(--tokens-color-text-text-brand)]'
                }`}
                style={isDark ? {
                  backgroundColor: 'var(--tokens-color-surface-surface-card-hover)',
                  border: '1px solid var(--tokens-color-border-border-subtle)'
                } : {}}
              >
                <ArrowRightSm className="w-4 h-4 text-white rotate-[-90deg]" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] ${
                  selectedPreferences.includes(2)
                    ? "text-white/80"
                    : "text-[color:var(--tokens-color-text-text-primary)]"
                }`}
              >
                {preferences[2].source}
              </span>
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={isDark && selectedPreferences.includes(2) ? {
                  backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                  color: 'var(--tokens-color-text-text-primary)'
                } : {
                  backgroundColor: selectedPreferences.includes(2) 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'var(--tokens-color-surface-surface-tertiary)',
                  color: selectedPreferences.includes(2) 
                    ? 'white' 
                    : 'var(--tokens-color-text-text-primary)'
                }}
              >
                <span className="text-sm">Choose Style</span>
                <DownArrow
                  className={` transition-transform flex-shrink-0 rotate-180`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
