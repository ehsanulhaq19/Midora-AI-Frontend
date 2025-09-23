'use client'
import React from 'react'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <div className="flex flex-col justify-between min-h-screen">
            <div className="pt-[60px] p-4">
                {children}
            </div>

            <div className="flex justify-center mx-auto px-4">
                <p className="font-text font-[number:var(--text-font-weight)] text-tokens-color-text-text-inactive-2 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-center max-w-full">
                    <span className="font-text font-[number:var(--text-font-weight)] text-[#29324180] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    All rights reserved@ 2025, midora.ai, You can view our{" "}
                    </span>

                    <span className="underline font-text [font-style:var(--text-font-style)] font-[number:var(--text-font-weight)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] text-[length:var(--text-font-size)]">
                    Privacy Policy
                    </span>

                    <span className="font-text font-[number:var(--text-font-weight)] text-[#29324180] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    {" "}
                    here
                    </span>
                </p>
            </div>
        </div>
    </>
  )
}
