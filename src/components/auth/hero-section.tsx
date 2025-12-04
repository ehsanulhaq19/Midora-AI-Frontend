import React from "react";
import { ButtonGroup } from "./button-group";
import { ArrowRightSm } from "@/icons";
import { t } from "@/i18n";
import { useTheme } from "@/hooks/use-theme";

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`flex flex-col w-full items-center gap-8 lg:gap-[88px] ${className}`}
    >
      <div className="flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto]">
        <p className="relative font-h01-heading-01 font-[number:var(--h01-heading-01-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-2xl sm:text-3xl lg:text-[length:var(--h01-heading-01-font-size)] text-center tracking-[var(--h01-heading-01-letter-spacing)] leading-[var(--h01-heading-01-line-height)] [font-style:var(--h01-heading-01-font-style)]">
          {t("hero.title")}
        </p>

        <div className="flex items-center justify-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <p className="relative w-full max-w-[930px] text-center tracking-[0] font-h03-heading03 font-[number:var(--h02-heading02-font-weight)] leading-[140%] text-[length:var(--text-large-font-size)]">
            {t("hero.subtitle")}
          </p>
        </div>
      </div>

      {/* Mobile layout: All 3 elements in column (below 800px) */}
      <div className="flex flex-col items-center justify-center gap-3 relative self-stretch w-full flex-[0_0_auto] sm:hidden">
        <img
          className="relative w-full max-w-[357px] h-[200px] rounded-[24px] object-cover"
          alt="Rectangle"
          src="/img/rectangle.png"
        />

        <div className="flex flex-col w-full max-w-[734px] min-h-[250px] items-start gap-2.5 p-4 relative rounded-3xl backdrop-blur-[4px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(4px)_brightness(100%)] bg-[linear-gradient(293deg,rgba(94,77,116,0.4)_2%,rgba(255,255,255,0.2)_100%)] bg-tokens-color-surface-surface-button-inactiv">
          <div className="flex flex-col w-full max-w-[643.04px] items-start gap-6 relative flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] gap-3">
                <p className="relative flex-1 font-h02-heading02 font-medium text-[color:var(--tokens-color-text-text-seconary)] text-base tracking-[-1.20px] leading-6">
                  {t("hero.title")}
                </p>

                <div className="inline-flex items-center gap-1 relative flex-[0_0_auto] self-start">
                  <img
                    className="relative w-[24px] h-[24px] aspect-[1] object-cover"
                    alt="Image"
                    src="/img/image-16-1.png"
                  />

                  <img
                    className="relative w-[24px] h-[26px] aspect-[0.96]"
                    alt="Image"
                    src="/img/image-17-1.png"
                  />

                  <img
                    className="relative w-[24px] h-[24px] aspect-[1] object-cover"
                    alt="Image"
                    src="/img/image-18-1.png"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <p className="relative w-full max-w-[535px] mt-[-1.00px] font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-sm tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                  {t("hero.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 relative self-stretch w-full flex-[0_0_auto]">
              <button
                type="button"
                className="self-stretch rounded-[var(--premitives-corner-radius-corner-radius-5)] h-12 border-[unset] px-4 py-1.5 flex bg-tokens-color-surface-surface-button-pressed w-full hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center"
                onClick={() => {}}
                aria-label="Read more about our features"
              >
                <span className="tracking-[-0.80px] text-sm flex-1 font-normal font-h02-heading02 leading-4 text-white text-center">
                  {t("hero.readMore")}
                </span>
                <ArrowRightSm className="relative w-4 h-4" color="white" />
              </button>

              <button
                type="button"
                className=" rounded-[var(--premitives-corner-radius-corner-radius-5)] h-12 min-h-[unset] border-[unset] px-4 py-1.5 flex bg-tokens-color-surface-surface-button-inactive w-full hover:bg-opacity-80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center"
                onClick={() => {}}
                aria-label="Add to wishlist"
              >
                <span className="text-tokens-color-surface-surface-button tracking-[-0.80px] text-sm flex-1 font-normal font-h02-heading02 leading-4 text-center">
                  {t("hero.wishlist")}
                </span>
                <ArrowRightSm className="relative w-4 h-4" color="#5E4D74" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-[367px] h-[200px] items-start gap-2.5 p-4 relative rounded-[var(--premitives-corner-radius-corner-radius-5)] bg-[linear-gradient(138deg,#1F1740_0%,#6B4392_100%)] bg-tokens-color-surface-surface-button">
          <div className="flex flex-col w-full items-start relative flex-[0_0_auto]">
            <div className={`relative self-stretch mt-[-1.00px] font-h02-heading02 font-medium text-2xl tracking-[-2.40px] leading-[1.2] ${isDark ? 'text-white' : 'text-[color:var(--tokens-color-surface-surface-primary)]'}`}>
              {t("hero.activeUsers")}
            </div>

            <p className="relative font-h03-heading03 font-[number:var(--text-large-font-weight)] text-white text-xs text-center tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] [font-style:var(--text-large-font-style)]">
              {t("hero.activeUsersDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* Tablet/Desktop layout: Two rows (800px - 1400px) */}
      <div className="hidden sm:flex xl:hidden flex-col items-center justify-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
        {/* First row: Image and Stats card */}
        <div className="flex flex-row items-center justify-center gap-3 w-full">
          <img
            className="relative w-full max-w-[357px] h-[250px] rounded-[24px] md:h-[300px] lg:h-[352px] object-cover"
            alt="Rectangle"
            src="/img/rectangle.png"
          />

          <div className="flex flex-col w-full max-w-[367px] h-[250px] md:h-[300px] lg:h-[352px] items-start gap-2.5 p-6 lg:p-9 relative rounded-[var(--premitives-corner-radius-corner-radius-5)] bg-[linear-gradient(138deg,#1F1740_0%,#6B4392_100%)] bg-tokens-color-surface-surface-button">
            <div className="flex flex-col w-full items-start relative flex-[0_0_auto]">
              <div className={`relative self-stretch mt-[-1.00px] font-h02-heading02 font-medium text-3xl md:text-4xl lg:text-5xl tracking-[-2.40px] leading-[1.2] ${isDark ? 'text-white' : 'text-[color:var(--tokens-color-surface-surface-primary)]'}`}>
                {t("hero.activeUsers")}
              </div>

              <p className="relative  font-h03-heading03 font-[number:var(--text-large-font-weight)] text-white text-sm md:text-base lg:text-[length:var(--text-large-font-size)] text-center tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] [font-style:var(--text-large-font-style)]">
                {t("hero.activeUsersDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Second row: Content card */}
        <div className="flex flex-col w-full max-w-[734px] min-h-[250px] md:h-[300px] lg:h-[352px] items-start gap-2.5 p-6 lg:p-9 relative rounded-3xl backdrop-blur-[4px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(4px)_brightness(100%)] bg-[linear-gradient(293deg,rgba(94,77,116,0.4)_2%,rgba(255,255,255,0.2)_100%)] bg-tokens-color-surface-surface-button-inactiv">
          <div className="flex flex-col w-full max-w-[643.04px] items-start gap-6 lg:gap-[59px] relative flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center relative self-stretch w-full flex-[0_0_auto] gap-3 sm:gap-0">
                <p className="relative flex-1  font-h02-heading02 font-medium text-[color:var(--tokens-color-text-text-seconary)] text-lg md:text-xl lg:text-2xl tracking-[-1.20px] leading-6">
                  {t("hero.title")}
                </p>

                <div className="inline-flex items-center gap-1 sm:gap-[5.15px] relative flex-[0_0_auto] self-start sm:self-auto">
                  <img
                    className="relative w-[32px] h-[32px] md:w-[42.9px] md:h-[42.9px] aspect-[1] object-cover"
                    alt="Image"
                    src="/img/image-16-1.png"
                  />

                  <img
                    className="relative w-[32px] h-[34px] md:w-[42.95px] md:h-[44.57px] aspect-[0.96]"
                    alt="Image"
                    src="/img/image-17-1.png"
                  />

                  <img
                    className="relative w-[32px] h-[32px] md:w-[42.9px] md:h-[42.9px] aspect-[1] object-cover"
                    alt="Image"
                    src="/img/image-18-1.png"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <p className="relative w-full max-w-[535px] mt-[-1.00px] font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-sm md:text-base lg:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                  {t("hero.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
              <button
                type="button"
                className="self-stretch gap-2 rounded-[var(--premitives-corner-radius-corner-radius-5)] border-[unset] px-5 py-1.5 bg-tokens-color-surface-surface-button-pressed w-full sm:w-[177px] hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center"
                onClick={() => {}}
                aria-label="Read more about our features"
              >
                <span className="tracking-[-0.80px] text-base flex-1 font-normal font-h02-heading02 leading-4 text-white text-start">
                  {t("hero.readMore")}
                </span>
                <ArrowRightSm className="relative w-5 h-5" color="black" />
              </button>

              <button
                type="button"
                className=" rounded-[var(--premitives-corner-radius-corner-radius-5)] h-12 min-h-[unset] border-[unset] px-5 py-1.5 bg-tokens-color-surface-surface-button-inactive w-full sm:w-[177px] hover:bg-opacity-80 transition-colors gap-2 duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center"
                onClick={() => {}}
                aria-label="Add to wishlist"
              >
                <span className="text-tokens-color-surface-surface-button tracking-[-0.80px] text-base flex-1 font-normal font-h02-heading02 leading-4 text-start">
                  {t("hero.wishlist")}
                </span>
                <ArrowRightSm className="relative w-5 h-5" color="#5E4D74" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout: All in one row (1400px+) */}
      <div className="hidden xl:flex items-center justify-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
        <img
          className="relative w-full max-w-[357px] h-[352px] object-cover"
          alt="Rectangle"
          src="/img/rectangle.png"
        />

        <div className="flex flex-col w-full max-w-[734px] h-[352px] items-start gap-2.5 p-9 relative rounded-3xl backdrop-blur-[4px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(4px)_brightness(100%)] bg-[linear-gradient(293deg,rgba(94,77,116,0.4)_2%,rgba(255,255,255,0.2)_100%)]">
          <div className="flex flex-col w-full max-w-[643.04px] items-start gap-6 lg:gap-[59px] relative flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-start relative self-stretch w-full flex-[0_0_auto]">
                <p className="relative flex-1  font-h02-heading02 font-medium text-[color:var(--tokens-color-text-text-seconary)] text-2xl tracking-[-1.20px] leading-6">
                  {t("hero.title")}
                </p>

                <div className="inline-flex items-center gap-[5.15px] relative flex-[0_0_auto]">
                  <img
                    className="relative w-[42.9px] h-[42.9px] aspect-[1] object-cover"
                    alt="Image"
                    src="/img/image-16-1.png"
                  />

                  <img
                    className="relative w-[42.95px] h-[44.57px] aspect-[0.96]"
                    alt="Image"
                    src="/img/image-17-1.png"
                  />

                  <img
                    className="relative w-[42.9px] h-[42.9px] aspect-[1] object-cover"
                    alt="Image"
                    src="/img/image-18-1.png"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <p className="relative w-full max-w-[535px] font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                  {t("hero.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
              <button
                type="button"
                className="self-stretch rounded-[var(--premitives-corner-radius-corner-radius-5)] border-[unset] px-5 py-1.5 gap-1.5 bg-tokens-color-surface-surface-button-pressed w-[177px] hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center"
                onClick={() => {}}
                aria-label="Read more about our features"
              >
                <span className="tracking-[-0.80px] text-base flex-1 font-normal font-h02-heading02 leading-4 text-white">
                  {t("hero.readMore")}
                </span>
                <ArrowRightSm className="relative w-5 h-5" color="white" />
              </button>

              <button
                type="button"
                className={`rounded-[var(--premitives-corner-radius-corner-radius-5)] h-12 min-h-[unset] border-[unset] px-5 py-1.5 ${isDark ? 'bg-tokens-color-surface-surface-button-pressed' : 'bg-tokens-color-surface-surface-button-inactive'}  w-[177px] hover:bg-opacity-80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex gap-1.5 items-center`}
                onClick={() => {}}
                aria-label="Add to wishlist"
              >
                <span className={`${isDark ?  'text-white' : 'text-tokens-color-surface-surface-button'}  tracking-[-0.80px] text-base flex-1 font-normal font-h02-heading02 leading-4`}>
                  {t("hero.wishlist")}
                </span>
                <ArrowRightSm className="relative w-5 h-5" color="#5E4D74" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[367px] h-[352px] items-start gap-2.5 p-9 relative rounded-[var(--premitives-corner-radius-corner-radius-5)] bg-[linear-gradient(138deg,#1F1740_0%,#6B4392_100%)] bg-tokens-color-surface-surface-button">
          <div className="flex flex-col w-[273px] items-start relative flex-[0_0_auto]">
            <div className={`relative self-stretch font-h02-heading02 font-medium text-5xl tracking-[-0.8px] leading-[140%] ${isDark ? 'text-white' : 'text-[color:var(--tokens-color-surface-surface-primary)]'}`}>
              {t("hero.activeUsers")}
            </div>

            <p className="relative font-h03-heading03 font-[number:var(--text-large-font-weight)] text-white text-[length:var(--text-large-font-size)] text-center tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] [font-style:var(--text-large-font-style)]">
              {t("hero.activeUsersDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
