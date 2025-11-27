'use client'

import React, { useState } from 'react'
import { PersonFace, ArrowRightSm } from '@/icons'

export const ProfileSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    workFunction: ''
  })

  const [selectedPreferences, setSelectedPreferences] = useState<number[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const togglePreference = (index: number) => {
    setSelectedPreferences(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const preferences = [
    { id: 1, text: 'Describe a forest at sunrise', source: 'Medora.ai' },
    { id: 2, text: 'Describe a forest at sunrise', source: 'Medora.ai' },
    { id: 3, text: 'Describe a forest at sunrise', source: 'Medora.ai' }
  ]

  return (
    <div className="flex-1 flex flex-col p-9">
      <div className="flex flex-col mt-9 bg-[#2932410D] gap-6 p-9 rounded-xl border">
        <h1 className="text-emphasis !text-[20px] text-[var(--tokens-color-text-text-seconary)]">
          Profile
        </h1>

        {/* Profile Picture and Name Fields */}
       
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                <PersonFace className="w-12 h-12" />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-6">
          {/* Name Fields */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your personal or work email"
                className="flex h-[54px] items-center gap-3 px-6 py-3 rounded-xl border border-[#dbdbdb] bg-transparent transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:border-blue-500 outline-none font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
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
                placeholder="Enter your personal or work email"
                className="flex h-[54px] items-center gap-3 px-6 py-3 rounded-xl border border-[#dbdbdb] bg-transparent transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:border-blue-500 outline-none font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
              />
            </div>
          </div>
        </div>

        {/* Your work function */}
        <div className="flex flex-col gap-2">
         <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          Your work function
          </label>
          <select
            name="workFunction"
            value={formData.workFunction}
            onChange={handleChange}
            className="flex h-[54px] items-center gap-3 px-6 py-3 rounded-xl border border-[#dbdbdb] bg-transparent transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:border-blue-500 outline-none font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
          >
            <option value="">Select your work function</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Choose your preference */}
        <div className="flex flex-col gap-4">
          <h2 className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            Choose your preference
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {preferences.slice(0, 2).map((pref, index) => (
              <div
                key={pref.id}
                onClick={() => togglePreference(index)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPreferences.includes(index)
                    ? 'bg-[color:var(--premitives-color-text-text-seconary)] border-[color:var(--premitives-color-text-text-seconary)]'
                    : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] ${
                    selectedPreferences.includes(index) ? 'text-white' : 'text-[color:var(--tokens-color-text-text-primary)]'
                  }`}>
                    {pref.text}
                  </p>
                  <button className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <ArrowRightSm className="w-4 h-4 text-white rotate-[-90deg]" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] ${
                    selectedPreferences.includes(index) ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {pref.source}
                  </span>
                  <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    selectedPreferences.includes(index)
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    <span className="text-sm">Choose Style</span>
                    <ArrowRightSm className="w-4 h-4 rotate-[-90deg]" />
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
                ? 'bg-[color:var(--premitives-color-brand-purple-1000)] border-[color:var(--premitives-color-brand-purple-1000)]'
                : 'bg-gray-50 border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] ${
                selectedPreferences.includes(2) ? 'text-white' : 'text-[color:var(--tokens-color-text-text-primary)]'
              }`}>
                {preferences[2].text}
              </p>
              <button className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                <ArrowRightSm className="w-4 h-4 text-white rotate-[-90deg]" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] ${
                selectedPreferences.includes(2) ? 'text-white/80' : 'text-gray-500'
              }`}>
                {preferences[2].source}
              </span>
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                selectedPreferences.includes(2)
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                <span className="text-sm">Choose Style</span>
                <ArrowRightSm className="w-4 h-4 rotate-[-90deg]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}