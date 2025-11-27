'use client'

import React, { useState } from 'react'
import { CaretDown } from '@/icons'

export const LanguageSection: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('auto-detect')

  const languages = [
    { value: 'auto-detect', label: 'Auto Detect' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value)
  }

  return (
    <div className="flex-1 flex flex-col p-9">
      <div className="flex flex-col mt-9 bg-[#2932410D] gap-6 p-9 rounded-xl border">
        <h1 className="font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--h02-heading02-font-size)] tracking-[var(--h02-heading02-letter-spacing)] leading-[var(--h02-heading02-line-height)] [font-style:var(--h02-heading02-font-style)]">
          Languages
        </h1>

        {/* Language preference section - 24px gap from title */}
        <div className="flex flex-col gap-4">
          <label className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            Language preference
          </label>
          
          {/* Dropdown field - 16px gap from label */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={handleChange}
              className="flex h-[54px] items-center gap-3 px-6 py-3 pr-12 rounded-xl border border-[#dbdbdb] bg-transparent transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 outline-none font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%] appearance-none w-full cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <CaretDown className="w-5 h-5 text-[color:var(--premitives-color-brand-purple-1000)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}