'use client'

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckBroken4 } from "@/icons";
import { pricingData } from "@/lib/pricing-data";
import { PricingPlan } from "@/types/pricing";
import { Slider } from "@/components/ui";
import { useSubscriptionPlans } from "@/hooks/use-subscription-plans";
import { SubscriptionPlan } from "@/api/subscription-plans/types";
import { useTheme } from "@/hooks/use-theme";

interface PricingSectionProps {
  className?: string;
  onSignupPage?: boolean;
  signupFormId?: string;
}

interface PricingCardProps {
  plan: SubscriptionPlan;
  onClick?: (() => void) | undefined;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Convert subscription plan to pricing plan format for display
  const displayPrice = plan.monthly_price;
  const displayPeriod = '/month';

  const baseClasses =
    "flex flex-col items-start gap-[88px] p-12 relative rounded-[var(--premitives-corner-radius-corner-radius-5)] transition-all duration-300 ease-in-out cursor-pointer group h-full min-h-[525px] w-full max-w-[383px] hover:scale-110 transform origin-center";

  // Light mode: keep original classes
  // Dark mode: use CSS variables for background colors
  const cardClasses = isDark 
    ? `${baseClasses}`
    : `${baseClasses} bg-premitives-color-light-gray-1000 hover:bg-[linear-gradient(150deg,#1F1740_0%,#6B4392_100%)] hover:bg-tokens-color-surface-surface-button`;
  
  // Dark mode background styles
  const darkModeStyles = isDark ? {
    backgroundColor: isHovered 
      ? 'var(--tokens-color-surface-surface-card-hover)' 
      : 'var(--tokens-color-surface-surface-card-default)',
    border: '1px solid var(--tokens-color-surface-surface-card-purple)',
  } : undefined;

  const textColorClasses =
    "text-[color:var(--tokens-color-text-text-seconary)] group-hover:text-tokens-color-text-text-neutral transition-colors duration-300";

  const iconColor = isHovered ? "white" : "#293241";
  const iconOpacity = "0.9";

  const priceColorClasses =
    "text-[color:var(--tokens-color-text-text-seconary)] group-hover:text-tokens-color-text-text-neutral transition-colors duration-300";

  return (
    <div
      className={cardClasses}
      style={darkModeStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex flex-col items-start gap-12 relative self-stretch w-full flex-1">
        <div className="flex flex-col items-start gap-[7px] relative self-stretch w-full flex-[0_0_auto]">
          <div
            className={`relative self-stretch mt-[-1.00px] font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] ${textColorClasses} app-text-3xl tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h02-heading02-line-height)] [font-style:var(--h02-heading02-font-style)]`}
          >
            {plan.name}
          </div>

          <div
            className={`relative self-stretch font-h02-heading02 font-[number:var(--text-font-weight)] ${textColorClasses} text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]`}
          >
            {plan.description}
          </div>
        </div>

        <div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <CheckBroken4
              className="!relative !w-[18px] !h-[18px] !aspect-[1] transition-colors duration-300"
              color={iconColor}
              opacity={iconOpacity}
            />
            <p
              className={`relative flex-1 mt-[-1.00px] font-h02-heading02 font-[number:var(--text-font-weight)] ${textColorClasses} text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]`}
            >
              {plan.credits_per_month.toLocaleString()} credits/month
            </p>
          </div>
          <div className="flex items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <CheckBroken4
              className="!relative !w-[18px] !h-[18px] !aspect-[1] transition-colors duration-300"
              color={iconColor}
              opacity={iconOpacity}
            />
            <p
              className={`relative flex-1 mt-[-1.00px] font-h02-heading02 font-[number:var(--text-font-weight)] ${textColorClasses} text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]`}
            >
              {plan.file_storage_gb} GB file storage
            </p>
          </div>
          <div className="flex items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <CheckBroken4
              className="!relative !w-[18px] !h-[18px] !aspect-[1] transition-colors duration-300"
              color={iconColor}
              opacity={iconOpacity}
            />
            <p
              className={`relative flex-1 mt-[-1.00px] font-h02-heading02 font-[number:var(--text-font-weight)] ${textColorClasses} text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]`}
            >
              {plan.vector_storage_entries.toLocaleString()} vector entries
            </p>
          </div>
          {plan.priority_support && (
            <div className="flex items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
              <CheckBroken4
                className="!relative !w-[18px] !h-[18px] !aspect-[1] transition-colors duration-300"
                color={iconColor}
                opacity={iconOpacity}
              />
              <p
                className={`relative flex-1 mt-[-1.00px] font-h02-heading02 font-[number:var(--text-font-weight)] ${textColorClasses} text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]`}
              >
                Priority support
              </p>
            </div>
          )}
          {plan.api_access !== 'none' && (
            <div className="flex items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
              <CheckBroken4
                className="!relative !w-[18px] !h-[18px] !aspect-[1] transition-colors duration-300"
                color={iconColor}
                opacity={iconOpacity}
              />
              <p
                className={`relative flex-1 mt-[-1.00px] font-h02-heading02 font-[number:var(--text-font-weight)] ${textColorClasses} text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]`}
              >
                API Access: {plan.api_access}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex flex-col items-center gap-2.5 relative flex-[0_0_auto]">
          <div
            className={`relative w-fit font-h02-heading02 font-[number:var(--text-large-font-weight)] ${priceColorClasses} text-[length:var(--text-large-font-size)] tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] whitespace-nowrap [font-style:var(--text-large-font-style)]`}
          >
            {plan.currency}
          </div>
        </div>

        <div className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto]">
          <p
            className={`relative w-fit mt-[-1.00px] font-h02-heading02 font-normal ${priceColorClasses} text-4xl leading-9 whitespace-nowrap`}
          >
            <span className="tracking-[var(--h02-heading02-letter-spacing)] font-h02-heading02 [font-style:var(--h02-heading02-font-style)] font-[number:var(--h02-heading02-font-weight)] leading-[var(--h02-heading02-line-height)] text-[length:var(--h02-heading02-font-size)]">
              {displayPrice.toFixed(2)}
            </span>

            <span className="font-h02-heading02 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] font-[number:var(--text-font-weight)]">
              {displayPeriod}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export const PricingSection: React.FC<PricingSectionProps> = ({
  className = "",
  onSignupPage = false,
  signupFormId = "signup-form-section",
}) => {
  const router = useRouter();
  const { plans, loadPlans, selectPlan, activeSubscription, loadActiveSubscription, isLoading } = useSubscriptionPlans();
  const hasLoadedRef = useRef(false);
  const hasLoadedSubscriptionRef = useRef(false);

  useEffect(() => {
    // Only load plans once on mount if they haven't been loaded yet
    if (!hasLoadedRef.current && plans.length === 0 && !isLoading) {
      hasLoadedRef.current = true;
      loadPlans(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    // Don't load active subscription on signup page
    if (onSignupPage) {
      return;
    }
    
    if (!hasLoadedSubscriptionRef.current) {
      hasLoadedSubscriptionRef.current = true;
      loadActiveSubscription().catch((err) => {
        // Only log actual errors, not "not found" (which returns null, not an error)
        // SUBSCRIPTION_NOT_FOUND returns null without throwing, so this catch won't execute for that case
        console.error('Error loading subscription:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSignupPage]); // Include onSignupPage in dependencies

  const handlePlanClick = (plan: SubscriptionPlan) => {
    selectPlan(plan);
    
    if (onSignupPage) {
      // Scroll to signup form section
      const signupFormElement = document.getElementById(signupFormId);
      if (signupFormElement) {
        signupFormElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to checkout page
      router.push(`/checkout?plan=${plan.uuid}`);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col w-full items-center gap-8 lg:gap-[88px] ${className}`}>
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col w-full items-center gap-8 lg:gap-[88px] ${className}`}
    >
      <div className="flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto]">
        <p className="relative self-stretch  font-h01-heading-01 font-[number:var(--h01-heading-01-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-2xl sm:text-3xl lg:text-[length:var(--h01-heading-01-font-size)] text-center tracking-[var(--h01-heading-01-letter-spacing)] leading-[var(--h01-heading-01-line-height)] [font-style:var(--h01-heading-01-font-style)]">
          {pricingData.title}
        </p>

        <div className="flex items-center justify-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <p className="relative w-full max-w-[930px] font-h02-heading02 font-[number:var(--text-large-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-base sm:text-lg lg:text-[length:var(--text-large-font-size)] text-center tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] [font-style:var(--text-large-font-style)]">
            {pricingData.subtitle}
          </p>
        </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden lg:flex flex-wrap items-stretch justify-center gap-[48px_48px] relative self-stretch w-full flex-[0_0_auto]">
        {plans.map((plan) => (
          <PricingCard key={plan.uuid} plan={plan} onClick={() => handlePlanClick(plan)} />
        ))}
      </div>

      {/* Tablet Slider Layout - Center mode with partial adjacent cards */}
      <div className="hidden md:block lg:hidden w-full">
        <Slider
          slidesToShow={1}
          slidesToScroll={1}
          showArrows={true}
          infinite={true}
          centerMode={true}
          centerPadding="60px"
          className="px-4"
        >
          {plans.map((plan) => (
            <PricingCard key={plan.uuid} plan={plan} onClick={() => handlePlanClick(plan)} />
          ))}
        </Slider>
      </div>

      {/* Mobile Slider Layout - Single card per slide */}
      <div className="md:hidden w-full">
        <Slider
          slidesToShow={1}
          slidesToScroll={1}
          showArrows={true}
          infinite={true}
          className="px-4"
        >
          {plans.map((plan) => (
            <PricingCard key={plan.uuid} plan={plan} onClick={() => handlePlanClick(plan)} />
          ))}
        </Slider>
      </div>
    </div>
  );
};
