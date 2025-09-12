import React from 'react'

interface FooterSectionProps {
  className?: string
}

export const FooterSection: React.FC<FooterSectionProps> = ({ className }) => {
  const handleLinkClick = (linkName: string) => {
    // Add navigation logic here
  }

  return (
    <div className={`flex flex-col xl:flex-row w-full min-h-[264px] items-start xl:items-center xl:justify-around gap-8 xl:gap-[135px] p-6 sm:p-8 lg:p-12 bg-tokens-color-surface-surface-dark ${className}`}>
      {/* Logo and Legal Text Section */}
      <div className="flex flex-col items-start gap-6 lg:gap-[76px] relative flex-[0_0_auto] w-full xl:w-auto">
        <img
          className="relative w-[120px] sm:w-[150.55px] h-[23px] sm:h-[29px] bg-blend-luminosity aspect-[5.19] object-cover"
          alt="Logo"
          src="/img/logo-1.png"
        />

        <p className="relative w-full xl:w-fit font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          <span className="font-text font-[number:var(--text-font-weight)] text-[#f2f2f24c] text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            This site is protected by reCAPTCHA Enterprise. The Google{" "}
          </span>

          <a
            href="https://policies.google.com/privacy"
            rel="noopener noreferrer"
            target="_blank"
            className="underline hover:text-white transition-colors duration-200"
          >
            <span className="underline font-text [font-style:var(--text-font-style)] font-[number:var(--text-font-weight)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] text-sm sm:text-[length:var(--text-font-size)]">
              Privacy Policy
            </span>
          </a>

          <span className="font-text font-[number:var(--text-font-weight)] text-[#f2f2f24c] text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            {" "}
            and{" "}
          </span>

          <a
            href="https://policies.google.com/terms"
            rel="noopener noreferrer"
            target="_blank"
            className="underline hover:text-white transition-colors duration-200"
          >
            <span className="underline font-text [font-style:var(--text-font-style)] font-[number:var(--text-font-weight)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] text-sm sm:text-[length:var(--text-font-size)]">
              Terms of Service
            </span>
          </a>

          <span className="font-text font-[number:var(--text-font-weight)] text-[#f2f2f24c] text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            {" "}
            apply.
          </span>
        </p>
      </div>

      {/* Navigation Links Section */}
      <div className="flex flex-row sm:flex-row xl:flex-row gap-8 xl:gap-[100px] w-full xl:w-auto">
        {/* Company Links */}
        <div className="flex flex-col gap-3 lg:gap-4">
          <div className="flex flex-col gap-2 lg:gap-3">
            <button
              onClick={() => handleLinkClick('Product')}
              className="text-left font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200 px-1"
            >
              Product
            </button>
            <button
              onClick={() => handleLinkClick('Research')}
              className="text-left font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200 px-1"
            >
              Research
            </button>
            <button
              onClick={() => handleLinkClick('Careers')}
              className="text-left font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200 px-1"
            >
              Careers
            </button>
            <button
              onClick={() => handleLinkClick('Company')}
              className="text-left font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200 px-1"
            >
              Company
            </button>
            <button
              onClick={() => handleLinkClick('News')}
              className="text-left font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200 px-1"
            >
              News
            </button>
            <button
              onClick={() => handleLinkClick('Catalog')}
              className="text-left font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200 px-1"
            >
              Catalog
            </button>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col gap-3 lg:gap-4">
          <div className="flex flex-col gap-2 lg:gap-3">
            <button
              onClick={() => handleLinkClick('Terms of Services')}
              className="text-left font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200 px-1"
            >
              Terms of Services
            </button>
            <button
              onClick={() => handleLinkClick('Privacy Policy')}
              className="text-left font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200 px-1"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleLinkClick('Your Privacy Choices')}
              className="text-left font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200 px-1"
            >
              Your Privacy Choices
            </button>
            <button
              onClick={() => handleLinkClick('Compliance')}
              className="text-left font-text font-[number:var(--text-font-weight)] text-premitives-color-light-gray-300 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200 px-1"
            >
              Compliance
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
