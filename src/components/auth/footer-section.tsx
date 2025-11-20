import React, { useState } from 'react'
import { Twitter, Facebook, GitHub, Instagram } from '@/icons'
import { InputWithButton } from '@/components/ui'

interface FooterSectionProps {
  className?: string
}

export const FooterSection: React.FC<FooterSectionProps> = ({ className }) => {
  const [email, setEmail] = useState('')
  
  const handleLinkClick = (linkName: string) => {
    // Add navigation logic here
  }



  return (
    <div className={`flex flex-col justify-between xl:flex-row w-full min-h-[264px] items-start xl:items-start gap-8 xl:gap-0 p-6 sm:p-8 lg:p-24 bg-tokens-color-surface-surface-dark ${className}`}>
      {/* Column 1: Logo and Newsletter Signup */}
      <div className="flex flex-col items-start gap-9 relative flex-[0_0_auto] w-full xl:w-auto ">
        <img
          className="relative w-[120px] sm:w-[150.55px] h-[23px] sm:h-[29px] bg-blend-luminosity aspect-[5.19] object-cover"
          alt="Logo"
          src="/img/Footer_logo.png"
        />

        <div className="flex flex-col gap-6 w-full xl:w-auto">
          <p className="relative w-full xl:w-fit font-h02-heading02 font-[number:var(--text-font-weight)] text-premitives-color-light-gray-700 text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            Sign up to our newsletter today
          </p>

          <InputWithButton
            className="!self-stretch !w-full md:!w-[350px] xl:w-auto"
            placeholder="Enter your personal or work email"
            // onSubmit={handleNewsletterSubmit}
            value={email}
            onChange={setEmail}
            type="email"
            variant="dark"
          />
        </div>
      </div>

      {/* Columns 2-4: Use Cases, Company, Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 xl:gap-[128px]">
        {/* Column 2: Use Cases */}
        <div className="flex flex-col gap-4 lg:gap-6">
          <h3 className="font-h02-heading02 font-normal text-base leading-[1.4] tracking-normal text-white">
            Use Cases
          </h3>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleLinkClick('Product')}
              className="text-left font-h02-heading02 font-normal text-sm leading-[1.4] tracking-normal text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200 px-1"
            >
              Product
            </button>
            <button
              onClick={() => handleLinkClick('Research')}
              className="text-left font-h02-heading02 font-normal text-sm leading-[1.4] tracking-normal text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200 px-1"
            >
              Research
            </button>
            <button
              onClick={() => handleLinkClick('Careers')}
              className="text-left font-h02-heading02 font-normal text-sm leading-[1.4] tracking-normal text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200 px-1"
            >
              Careers
            </button>
            <button
              onClick={() => handleLinkClick('Company')}
              className="text-left font-h02-heading02 font-normal text-sm leading-[1.4] tracking-normal text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200 px-1"
            >
              Company
            </button>
            <button
              onClick={() => handleLinkClick('News')}
              className="text-left font-h02-heading02 font-normal text-sm leading-[1.4] tracking-normal text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200 px-1"
            >
              News
            </button>
            <button
              onClick={() => handleLinkClick('Catalog')}
              className="text-left font-h02-heading02 font-normal text-sm leading-[1.4] tracking-normal text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200 px-1"
            >
              Catalog
            </button>
          </div>
        </div>

        {/* Column 3: Company */}
        <div className="flex flex-col gap-4 lg:gap-6">
          <h3 className="font-h02-heading02 font-normal text-base leading-[1.4] tracking-normal text-white">
            Company
          </h3>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleLinkClick('Terms of Services')}
              className="text-left font-h02-heading02 font-normal text-sm leading-[1.4] tracking-normal text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200 px-1"
            >
              Terms of Services
            </button>
            <button
              onClick={() => handleLinkClick('Privacy Policy')}
              className="text-left font-h02-heading02 font-normal text-sm leading-[1.4] tracking-normal text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200 px-1"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleLinkClick('Your Privacy Choices')}
              className="text-left font-h02-heading02 font-normal text-sm leading-[1.4] tracking-normal text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200 px-1"
            >
              Your Privacy Choices
            </button>
            <button
              onClick={() => handleLinkClick('Compliance')}
              className="text-left font-h02-heading02 font-normal text-sm leading-[1.4] tracking-normal text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200 px-1"
            >
              Compliance
            </button>
          </div>
        </div>

        {/* Column 4: Contact */}
        <div className="flex flex-col gap-4 lg:gap-6">
        <h3 className="font-h02-heading02 font-normal text-base leading-[1.4] tracking-normal text-white">
          Contact
        </h3>
        <div className="flex flex-col gap-4">
          <a
            href="mailto:contact@midora.com"
            className="font-h02-heading02 font-[number:var(--text-font-weight)] text-premitives-color-light-gray-700 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200"
          >
            contact@midora.com
          </a>
          <a
            href="tel:+1234758498743746"
            className="font-h02-heading02 font-[number:var(--text-font-weight)] text-premitives-color-light-gray-700 hover:text-white text-sm sm:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors duration-200"
          >
            +1 234 7584 9874 3746
          </a>
          <div className="flex flex-row gap-4 mt-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <GitHub className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-premitives-color-light-gray-700 hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
