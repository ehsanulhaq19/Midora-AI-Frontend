"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubscriptionPlans } from "@/hooks/use-subscription-plans";
import { useDispatch } from "react-redux";
import { setActiveSubscription } from "@/store/slices/subscription-plans-slice";
import { subscriptionPlansApi } from "@/api/subscription-plans/api";
import { SubscriptionCheckoutRequest } from "@/api/subscription-plans/types";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error-handler";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ArrowRightSm, MoreOptions, TickIcon } from "@/icons";
import { useTheme } from "@/hooks/use-theme";
import { IconButton, ActionButton } from "@/components/ui/buttons";
import { t, tWithParams } from "@/i18n";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

// List of all countries with ISO 3166-1 alpha-2 codes
const COUNTRIES = [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Netherlands", code: "NL" },
  { name: "Belgium", code: "BE" },
  { name: "Switzerland", code: "CH" },
  { name: "Austria", code: "AT" },
  { name: "Sweden", code: "SE" },
  { name: "Norway", code: "NO" },
  { name: "Denmark", code: "DK" },
  { name: "Finland", code: "FI" },
  { name: "Poland", code: "PL" },
  { name: "Ireland", code: "IE" },
  { name: "Portugal", code: "PT" },
  { name: "Greece", code: "GR" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Hungary", code: "HU" },
  { name: "Romania", code: "RO" },
  { name: "Bulgaria", code: "BG" },
  { name: "Croatia", code: "HR" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Lithuania", code: "LT" },
  { name: "Latvia", code: "LV" },
  { name: "Estonia", code: "EE" },
  { name: "Luxembourg", code: "LU" },
  { name: "Malta", code: "MT" },
  { name: "Cyprus", code: "CY" },
  { name: "Iceland", code: "IS" },
  { name: "Japan", code: "JP" },
  { name: "South Korea", code: "KR" },
  { name: "China", code: "CN" },
  { name: "India", code: "IN" },
  { name: "Singapore", code: "SG" },
  { name: "Malaysia", code: "MY" },
  { name: "Thailand", code: "TH" },
  { name: "Indonesia", code: "ID" },
  { name: "Philippines", code: "PH" },
  { name: "Vietnam", code: "VN" },
  { name: "Hong Kong", code: "HK" },
  { name: "Taiwan", code: "TW" },
  { name: "New Zealand", code: "NZ" },
  { name: "South Africa", code: "ZA" },
  { name: "Brazil", code: "BR" },
  { name: "Mexico", code: "MX" },
  { name: "Argentina", code: "AR" },
  { name: "Chile", code: "CL" },
  { name: "Colombia", code: "CO" },
  { name: "Peru", code: "PE" },
  { name: "Uruguay", code: "UY" },
  { name: "Paraguay", code: "PY" },
  { name: "Venezuela", code: "VE" },
  { name: "Ecuador", code: "EC" },
  { name: "Bolivia", code: "BO" },
  { name: "Costa Rica", code: "CR" },
  { name: "Panama", code: "PA" },
  { name: "Guatemala", code: "GT" },
  { name: "Honduras", code: "HN" },
  { name: "El Salvador", code: "SV" },
  { name: "Nicaragua", code: "NI" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Jamaica", code: "JM" },
  { name: "Trinidad and Tobago", code: "TT" },
  { name: "Barbados", code: "BB" },
  { name: "Bahamas", code: "BS" },
  { name: "Belize", code: "BZ" },
  { name: "Guyana", code: "GY" },
  { name: "Suriname", code: "SR" },
  { name: "Israel", code: "IL" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Qatar", code: "QA" },
  { name: "Kuwait", code: "KW" },
  { name: "Bahrain", code: "BH" },
  { name: "Oman", code: "OM" },
  { name: "Jordan", code: "JO" },
  { name: "Lebanon", code: "LB" },
  { name: "Egypt", code: "EG" },
  { name: "Turkey", code: "TR" },
  { name: "Russia", code: "RU" },
  { name: "Ukraine", code: "UA" },
  { name: "Belarus", code: "BY" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Armenia", code: "AM" },
  { name: "Georgia", code: "GE" },
  { name: "Moldova", code: "MD" },
  { name: "Albania", code: "AL" },
  { name: "North Macedonia", code: "MK" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Serbia", code: "RS" },
  { name: "Montenegro", code: "ME" },
  { name: "Kosovo", code: "XK" },
  { name: "Mongolia", code: "MN" },
  { name: "Myanmar", code: "MM" },
  { name: "Cambodia", code: "KH" },
  { name: "Laos", code: "LA" },
  { name: "Bangladesh", code: "BD" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Nepal", code: "NP" },
  { name: "Bhutan", code: "BT" },
  { name: "Pakistan", code: "PK" },
  { name: "Afghanistan", code: "AF" },
  { name: "Iran", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Yemen", code: "YE" },
  { name: "Syria", code: "SY" },
  { name: "Palestine", code: "PS" },
  { name: "Libya", code: "LY" },
  { name: "Tunisia", code: "TN" },
  { name: "Algeria", code: "DZ" },
  { name: "Morocco", code: "MA" },
  { name: "Sudan", code: "SD" },
  { name: "Ethiopia", code: "ET" },
  { name: "Kenya", code: "KE" },
  { name: "Tanzania", code: "TZ" },
  { name: "Uganda", code: "UG" },
  { name: "Ghana", code: "GH" },
  { name: "Nigeria", code: "NG" },
  { name: "Senegal", code: "SN" },
  { name: "Ivory Coast", code: "CI" },
  { name: "Cameroon", code: "CM" },
  { name: "Angola", code: "AO" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" },
  { name: "Botswana", code: "BW" },
  { name: "Namibia", code: "NA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Madagascar", code: "MG" },
  { name: "Mauritius", code: "MU" },
  { name: "Seychelles", code: "SC" },
  { name: "Fiji", code: "FJ" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Solomon Islands", code: "SB" },
  { name: "Vanuatu", code: "VU" },
  { name: "Samoa", code: "WS" },
  { name: "Tonga", code: "TO" },
].sort((a, b) => a.name.localeCompare(b.name));

interface CheckoutFormProps {
  plan: any;
  billingCycle: "monthly" | "annual";
  onBillingCycleChange: (cycle: "monthly" | "annual") => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  plan,
  billingCycle,
  onBillingCycleChange,
}) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    country: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const price =
    billingCycle === "monthly" ? plan.monthly_price : plan.annual_price;
  const effectiveMonthlyPrice =
    billingCycle === "annual" ? plan.annual_price / 12 : plan.monthly_price;
  const savings =
    billingCycle === "annual" ? plan.monthly_price * 12 - plan.annual_price : 0;
  const savingsPercent =
    savings > 0 ? Math.round((savings / (plan.monthly_price * 12)) * 100) : 0;

  // Calculate renewal date (1 year from now for annual, 1 month for monthly)
  const renewalDate = new Date();
  if (billingCycle === "annual") {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  } else {
    renewalDate.setMonth(renewalDate.getMonth() + 1);
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.address_line_1.trim())
      newErrors.address_line_1 = "Address is required";
    if (!agreedToTerms) newErrors.terms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!stripe || !elements) {
      showErrorToast(
        "Stripe not loaded",
        "Please wait for payment system to load"
      );
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Create payment method
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: formData.full_name,
            email: formData.email,
            address: {
              line1: formData.address_line_1,
              line2: formData.address_line_2 || undefined,
              city: formData.city || undefined,
              state: formData.state || undefined,
              postal_code: formData.postal_code || undefined,
              country: formData.country,
            },
          },
        });

      if (pmError || !paymentMethod) {
        throw new Error(pmError?.message || "Failed to create payment method");
      }

      // Prepare checkout request
      const checkoutData: SubscriptionCheckoutRequest = {
        plan_uuid: plan.uuid,
        billing_cycle: billingCycle,
        full_name: formData.full_name,
        email: formData.email,
        country: formData.country,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2 || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        postal_code: formData.postal_code || undefined,
        payment_method_id: paymentMethod.id,
      };

      // Call checkout API
      const response = await subscriptionPlansApi.checkout(checkoutData);

      if (response.error) {
        const errorObject = response.processedError || {
          error_type: "CHECKOUT_FAILED",
          error_message: response.error,
          error_id: response.error_id,
          status: response.status,
        };
        throw new Error(JSON.stringify(errorObject));
      }

      // Check if response has subscription data
      if (response.data && response.data.subscription) {
        // Update Redux store with the new subscription
        const subscription = response.data.subscription;
        dispatch(setActiveSubscription(subscription));
        
        // Show success message
        showSuccessToast(
          "Subscription Created",
          response.data.message || "Your subscription has been successfully created!"
        );
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/pricing");
        }, 500);
      } else {
        // Fallback: Still show success even if subscription data is missing
        showSuccessToast(
          "Subscription Created",
          "Your subscription has been successfully created!"
        );
        router.push("/pricing");
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      showErrorToast("Checkout Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "flex h-[54px] items-center gap-3 relative self-stretch w-full rounded-xl border border-solid transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 focus-within:border-transparent px-4";
  
  const inputStyle: React.CSSProperties = isDark ? {
    backgroundColor: '#303030',
    borderColor: 'var(--tokens-color-border-border-subtle)',
  } : {
    backgroundColor: '#ffffff',
    borderColor: '#dbdbdb',
  };
  const formattedRenewalDate = renewalDate.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
  const subtotalLabel = billingCycle === "annual" ? "Annually" : "Monthly";

  const primaryActionColor = "#6B3EFF";

  return (
    <div className="flex min-h-screen bg-[color:var(--tokens-color-surface-surface-primary)]">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="max-w-[640px] mx-auto w-full px-4 py-6 lg:py-12">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <IconButton
              onClick={() => router.back()}
              icon={<ArrowRightSm className="w-5 h-5 rotate-180" color="var(--tokens-color-text-text-primary)" />}
              aria-label="Go back"
              variant="ghost"
              size="md"
              className="rounded-full"
            />
            {/* <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[color:var(--tokens-color-surface-surface-secondary)] transition-colors"
              aria-label="Menu"
            >
              <MoreOptions
                className="w-5 h-5"
                color="var(--tokens-color-text-text-primary)"
              />
            </button> */}
          </div>

          <div className="flex flex-col gap-6 mt-4">
            {/* Plan Selection */}
            <div className={`flex flex-col gap-9 p-4 rounded-2xl shadow-sm ${isDark ? 'bg-[color:var(--tokens-color-surface-surface-primary)]' : 'bg-white'}`}>
              <h1 className={`checkout-plan-name ${isDark ? 'text-white' : 'text-[color:var(--tokens-color-text-text-brand)]'}`}>
                {plan.name}
              </h1>

              <div className="flex flex-col md:flex-row gap-6 w-full">
                <ActionButton
                  type="button"
                  onClick={() => onBillingCycleChange("monthly")}
                  variant={billingCycle === "monthly" ? "primary" : "outline"}
                  fullWidth
                  className={`flex-1 flex flex-col items-start gap-3 p-4 !h-auto !justify-start ${
                    isDark 
                      ? billingCycle === "monthly"
                        ? "!bg-[#181818] !border-transparent"
                        : "!bg-[#303030] !border-[color:var(--tokens-color-border-border-subtle)]"
                      : billingCycle === "monthly"
                        ? "bg-[#1F1740] border-0 text-white shadow-lg"
                        : "bg-[#F8F8FC] border border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                        billingCycle === "monthly"
                          ? "bg-[#6B3EFF] border-[#6B3EFF]"
                          : "bg-transparent border-gray-400"
                      }`}
                    >
                      {billingCycle === "monthly" && (
                        <TickIcon className="w-3 h-3" color="white" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 flex-1 relative">
                      <div className={`checkout-emphasis text-start ${
                        isDark 
                          ? 'text-white' 
                          : billingCycle === "monthly"
                            ? "text-white"
                            : "text-[color:var(--tokens-color-text-text-brand)]"
                      }`}>
                        Monthly
                      </div>
                      <span className={
                        isDark 
                          ? 'text-white/90' 
                          : billingCycle === "monthly"
                            ? "text-white/90"
                            : "text-[color:var(--tokens-color-text-text-inactive-2)]"
                      }>
                        ${plan.monthly_price.toFixed(2)}/month + Tax
                      </span>
                    </div>
                  </div>
                </ActionButton>

                <ActionButton
                  type="button"
                  onClick={() => onBillingCycleChange("annual")}
                  variant={billingCycle === "annual" ? "primary" : "outline"}
                  fullWidth
                  className={`flex-1 flex flex-col items-start gap-3 p-4 !h-auto !justify-start relative ${
                    isDark 
                      ? billingCycle === "annual"
                        ? "!bg-[#181818] !border-transparent"
                        : "!bg-[#303030] !border-[color:var(--tokens-color-border-border-subtle)]"
                      : billingCycle === "annual"
                        ? "bg-[#1F1740] border-0 text-white shadow-lg"
                        : "bg-[#F8F8FC] border border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                        billingCycle === "annual"
                          ? "bg-[#6B3EFF] border-[#6B3EFF]"
                          : "bg-transparent border-gray-400"
                      }`}
                    >
                      {billingCycle === "annual" && (
                        <TickIcon className="w-3 h-3" color="white" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 flex-1 relative">
                      <div className="flex items-center justify-between">
                        <span className={`checkout-emphasis ${
                          isDark 
                            ? 'text-white' 
                            : billingCycle === "annual"
                              ? "text-white"
                              : "text-[color:var(--tokens-color-text-text-brand)]"
                        }`}>
                          Yearly
                        </span>
                        {savingsPercent > 0 && billingCycle === "annual" && (
                          <div className="absolute -top-[2rem] -right-[7rem] px-2 py-1 rounded-md bg-[#FF6B6B] flex items-center justify-center shadow-md z-10">
                            <span className="text-white text-xs font-bold">
                              Save {savingsPercent}%
                            </span>
                          </div>
                        )}
                      </div>
                      <span className={
                        isDark 
                          ? 'text-white/90' 
                          : billingCycle === "annual"
                            ? "text-white/90"
                            : "text-[color:var(--tokens-color-text-text-inactive-2)]"
                      }>
                        ${effectiveMonthlyPrice.toFixed(2)}/month + Tax
                      </span>
                    </div>
                  </div>
                </ActionButton>
              </div>
            </div>

            {/* Order Details */}
            <div className="flex flex-col gap-4 px-4">
              <div className={`flex flex-col items-start p-4 gap-6 rounded-xl w-full ${isDark ? '' : 'bg-gray-100'}`} style={isDark ? { backgroundColor: 'var(--tokens-color-surface-surface-card-hover)' } : {}}>
                <h2
                  className={`text-[20px] font-semibold ${isDark ? 'text-white' : 'text-[color:var(--premitives-color-brand-purple-1000)]'}`}
                  style={{ fontFamily: "Poppins, Helvetica" }}
                >
                  {t('checkout.orderDetails')}
                </h2>
                <div className="flex flex-col w-full gap-4">
                  <div className={`flex items-center justify-between pb-4 border-b ${isDark ? '' : 'border-gray-200'}`} style={isDark ? { borderColor: 'rgba(255, 255, 255, 0.1)' } : {}}>
                    <span className={`checkout-emphasis ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      {plan.name} / {subtotalLabel}
                    </span>
                    <span className={`checkout-emphasis ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      ${price.toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between pb-4 border-b ${isDark ? '' : 'border-gray-200'}`} style={isDark ? { borderColor: 'rgba(255, 255, 255, 0.1)' } : {}}>
                    <span className={`checkout-emphasis ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      {t('checkout.subtotal')}
                    </span>
                    <span className={`checkout-emphasis ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      ${price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`checkout-emphasis font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      {t('checkout.totalDueToday')}
                    </span>
                    <span className={`checkout-emphasis font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      ${price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`flex items-start gap-3 p-4 rounded-xl border w-full ${isDark ? '' : 'border-orange-200 bg-orange-50'}`} style={isDark ? { borderColor: 'rgba(255, 165, 0, 0.3)', backgroundColor: 'rgba(255, 165, 0, 0.1)' } : {}}>
                <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${isDark ? '' : 'border-orange-400 bg-orange-100'}`} style={isDark ? { borderColor: 'rgba(255, 165, 0, 0.5)', backgroundColor: 'rgba(255, 165, 0, 0.2)' } : {}}>
                  <span className={`text-xs font-semibold leading-none ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                    i
                  </span>
                </div>
                <p className={`text-sm flex-1 ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>
                  Your subscription will automatically renew on{" "}
                  {formattedRenewalDate}. You will be charged $
                  {price.toFixed(2)}/
                  {billingCycle === "annual" ? "year" : "month"} + tax.
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col items-start p-4 gap-8">
              <h2
                className={`text-[20px] font-semibold ${isDark ? 'text-white' : 'text-[color:var(--premitives-color-brand-purple-1000)]'}`}
                style={{ fontFamily: "Poppins, Helvetica" }}
              >
                Payment Method
              </h2>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full"
              >
                <div className="flex flex-col gap-2 w-full">
                  <label className={`checkout-emphasis ${isDark ? 'text-white' : 'text-[color:var(--tokens-color-text-text-primary)]'}`}>
                    Full Name
                  </label>
                  <div className={inputClasses} style={inputStyle}>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        handleInputChange("full_name", e.target.value)
                      }
                      placeholder="Enter your personal or work email"
                      className={`w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] text-sm ${isDark ? 'text-white' : 'text-black'}`}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-sm text-red-400">{errors.full_name}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[color:var(--tokens-color-text-text-primary)]'}`}>
                    Email
                  </label>
                  <div className={inputClasses} style={inputStyle}>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your personal or work email"
                      className={`w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] text-sm ${isDark ? 'text-white' : 'text-black'}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className={`checkout-emphasis ${isDark ? 'text-white' : 'text-[color:var(--tokens-color-text-text-primary)]'}`}>
                    Country or Region
                  </label>
                  <div className={inputClasses} style={inputStyle}>
                    <select
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      className={`w-full bg-transparent border-none outline-none text-sm cursor-pointer appearance-none ${isDark ? 'text-white' : 'text-black'}`}
                      style={{
                        backgroundImage: isDark 
                          ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")"
                          : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="" disabled style={isDark ? { backgroundColor: '#303030', color: '#ffffff' } : {}}>
                        Select your country
                      </option>
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code} style={isDark ? { backgroundColor: '#303030', color: '#ffffff' } : {}}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.country && (
                    <p className="text-sm text-red-400">{errors.country}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className={`checkout-emphasis ${isDark ? 'text-white' : 'text-[color:var(--tokens-color-text-text-primary)]'}`}>
                    Address line 1
                  </label>
                  <div className={inputClasses} style={inputStyle}>
                    <input
                      type="text"
                      value={formData.address_line_1}
                      onChange={(e) =>
                        handleInputChange("address_line_1", e.target.value)
                      }
                      placeholder="Enter your address"
                      className={`w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] text-sm ${isDark ? 'text-white' : 'text-black'}`}
                    />
                  </div>
                  {errors.address_line_1 && (
                    <p className="text-sm text-red-400">
                      {errors.address_line_1}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className={`checkout-emphasis ${isDark ? 'text-white' : 'text-[color:var(--tokens-color-text-text-primary)]'}`}>
                    Card Number
                  </label>
                  <div className={`${inputClasses} !px-0`} style={inputStyle}>
                    <div className="w-full px-4">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: isDark ? "#ffffff" : "#424770",
                              fontFamily:
                                "system-ui, -apple-system, sans-serif",
                              "::placeholder": {
                                color: "#aab7c4",
                              },
                            },
                            invalid: {
                              color: isDark ? "#ff6b6b" : "#9e2146",
                            },
                          },
                          hidePostalCode: true,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-[color:var(--tokens-color-border-border-inactive)] text-white cursor-pointer focus:ring-2 focus:ring-offset-2"
                    style={{
                      accentColor: primaryActionColor,
                    }}
                  />
                  <label
                    htmlFor="terms"
                    className={`checkout-emphasis ${isDark ? 'text-white' : 'text-black'}`}
                  >
                    {tWithParams('checkout.termsAgreement', { 
                      frequency: billingCycle === "annual" ? t('checkout.annually') : t('checkout.monthly')
                    })}
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-400">{errors.terms}</p>
                )}

                <ActionButton
                  type="submit"
                  disabled={loading || !stripe || !elements}
                  loading={loading}
                  variant="primary"
                  fullWidth
                  className="rounded-xl text-base font-semibold"
                >
                  {loading ? t('checkout.processing') : t('checkout.checkOut')}
                </ActionButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { plans, selectedPlan, getPlanByUuid, selectPlan, loadPlans } =
    useSubscriptionPlans();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual"
  );
  const [plan, setPlan] = useState<any>(null);
  const hasLoadedPlansRef = useRef(false);
  const hasSetPlanRef = useRef(false);

  // Load plans only once
  useEffect(() => {
    if (!hasLoadedPlansRef.current && plans.length === 0) {
      hasLoadedPlansRef.current = true;
      loadPlans(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set plan only once when plans are loaded
  useEffect(() => {
    // Don't set plan if we've already set it
    if (hasSetPlanRef.current) {
      return;
    }

    // Wait for plans to be loaded
    if (plans.length === 0) {
      return;
    }

    const planUuid = searchParams.get("plan");
    let planToSet = null;

    if (planUuid) {
      // Try to find plan by UUID from plans array
      planToSet = plans.find((p) => p.uuid === planUuid);
    } else if (selectedPlan) {
      // Use selected plan if no UUID in URL
      planToSet = selectedPlan;
    } else if (plans.length > 0) {
      // Fallback to first plan
      planToSet = plans[0];
    }

    if (planToSet) {
      hasSetPlanRef.current = true;
      setPlan(planToSet);
      // Only update selectedPlan if it's different to avoid triggering re-renders
      if (!selectedPlan || selectedPlan.uuid !== planToSet.uuid) {
        selectPlan(planToSet);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans, searchParams]); // Removed selectedPlan and selectPlan from dependencies to prevent loops

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('checkout.loadingPlanDetails')}</p>
        </div>
      </div>
    );
  }

  const stripeOptions: StripeElementsOptions = {
    mode: "payment",
    amount:
      billingCycle === "monthly"
        ? Math.round(plan.monthly_price * 100)
        : Math.round(plan.annual_price * 100),
    currency: "usd",
  };

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <CheckoutForm
        plan={plan}
        billingCycle={billingCycle}
        onBillingCycleChange={setBillingCycle}
      />
    </Elements>
  );
}
