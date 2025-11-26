"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightSm, MoreOptions, TickIcon } from "@/icons";
import { BackButton } from "../ui";

export const CheckoutContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "power";
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const [formData, setFormData] = useState({
    fullName: "",
    country: "",
    addressLine1: "",
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
  });
  const [agreed, setAgreed] = useState(false);

  const monthlyPrice = 12;
  const yearlyPrice = 200;
  const subtotal = billingPeriod === "yearly" ? yearlyPrice : monthlyPrice * 12;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "");
    return v.length >= 2 ? v.substring(0, 2) + "/" + v.substring(2, 4) : v;
  };

  const getRenewalDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });
  };

  const inputClasses =
    "flex h-[54px] items-center gap-3 relative self-stretch w-full rounded-xl border border-solid border-[#dbdbdb] bg-transparent transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:border-blue-500";

  return (
    <div className="grid grid-cols-3 w-full  overflow-y-auto bg-[color:var(--tokens-color-surface-surface-primary)]">
     <div className="flex items-start justify-start px-4"> <button
        onClick={() => router.back()}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[color:var(--tokens-color-surface-surface-secondary)] transition-colors"
        aria-label="Go back"
      >
        <ArrowRightSm
          className="w-5 h-5 rotate-180"
          color="var(--tokens-color-text-text-primary)"
        />
      </button> </div>
      <div className="max-w-[600px] mx-auto w-full px-4 py-6 lg:py-12 overflow-y-auto">
        {/* Header */}

        <div className="flex flex-col gap-6 mt-8">
          {/* Plan Selection */}
          <div className="flex flex-col gap-9 p-4">
            <h1 className="relative self-stretch font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[color:var(--tokens-color-text-text-brand)] app-text-3xl tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h02-heading02-line-height)] [font-style:var(--h02-heading02-font-style)]">
              Pro Plan
            </h1>
            <div className="flex gap-9 w-full">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`flex-1 flex flex-col items-start gap-3 p-4 rounded-xl border transition-all relative ${
                  billingPeriod === "monthly"
                    ? "bg-[#1F1740] border-0"
                    : "bg-[#F8F8FC] border border-gray-300"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                    billingPeriod === "monthly"
                      ? "bg-[color:var(--premitives-color-brand-purple-1000)] border-[color:var(--premitives-color-brand-purple-1000)]"
                      : "bg-transparent border-gray-400"
                  }`}
                >
                  {billingPeriod === "monthly" && (
                    <TickIcon className="w-3 h-3" color="#ffffff" />
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span
                    className={`font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-start text-[length:var(--text-font-size)] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--text-line-height)] ${
                      billingPeriod === "monthly"
                        ? "text-white"
                        : "text-[color:var(--tokens-color-text-text-brand)]"
                    }`}
                  >
                    Monthly
                  </span>
                  <span
                    className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] ${
                      billingPeriod === "monthly"
                        ? "text-white/90"
                        : "[color:var(--tokens-color-text-text-inactive-2)]"
                    }`}
                  >
                    ${monthlyPrice}.00/month + Tax
                  </span>
                </div>
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`flex-1 flex flex-col items-start gap-3 p-4 rounded-xl border transition-all relative ${
                  billingPeriod === "yearly"
                    ? "bg-[#1F1740] border-0"
                    : "bg-[#F8F8FC] border border-gray-300"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                    billingPeriod === "yearly"
                      ? "bg-[color:var(--premitives-color-brand-purple-1000)] border-[color:var(--premitives-color-brand-purple-1000)]"
                      : "bg-transparent border-gray-400"
                  }`}
                >
                  {billingPeriod === "yearly" && (
                    <TickIcon className="w-3 h-3" color="#ffffff" />
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1 relative">
                  <div className="flex items-center justify-between">
                    <span
                    className={`font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-start text-[length:var(--text-font-size)] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--text-line-height)] ${
                        billingPeriod === "yearly"
                          ? "text-white"
                          : "text-[color:var(--tokens-color-text-text-brand)]"
                        }`}
                    >
                      Yearly
                    </span>
                    {billingPeriod === "yearly" && (
                      <div className="absolute -top-[2rem] -right-[1.5rem] px-2 py-1 rounded-md bg-[#FF6C50] flex items-center justify-center shadow-md z-10">
                        <span className="text-white w-fit font-h02-heading02 font-[number:var(--text-small-font-weight)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-line-height)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
                          Save 17%
                        </span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] ${
                      billingPeriod === "yearly"
                        ? "text-white"
                        : "[color:var(--tokens-color-text-text-inactive-2)]"
                    }`}
                  >
                    ${monthlyPrice}.00/month + Tax
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Order Details */}
          <div className="flex flex-col gap-4 px-4 w-full">
            <div className="flex flex-col items-start p-4 gap-9 bg-gray-100 rounded-xl w-full">
              <h2
                className="relative self-stretch text-[20px] font-semibold text-[color:var(--premitives-color-brand-purple-1000)] leading-[100%] tracking-[var(--h05-heading05-letter-spacing)]"
                style={{ fontFamily: "Poppins, Helvetica" }}
              >
                Order Details
              </h2>
              <div className="flex flex-col w-full gap-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-gray-700 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    Pro Plan /{" "}
                    {billingPeriod === "yearly" ? "Annually" : "Monthly"}
                  </span>
                  <span className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-gray-700 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-gray-700 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    Subtotal
                  </span>
                  <span className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-gray-700 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-gray-700 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    Total due today
                  </span>
                  <span className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-gray-700 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-orange-200 bg-orange-50 w-full">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-orange-400 bg-orange-100 mt-0.5 flex-shrink-0">
                <span className="text-orange-600 text-xs font-semibold leading-none">
                  i
                </span>
              </div>
              <p className="font-h02-heading02 font-[number:var(--text-font-weight)] text-orange-800 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] flex-1">
                Your subscription will automatically renew on {getRenewalDate()}
                . You will be charged ${subtotal.toFixed(2)}/
                {billingPeriod === "yearly" ? "year" : "month"} + tax.
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col items-start p-4 gap-9">
            <h2
              className="relative self-stretch text-[20px] font-semibold text-[color:var(--premitives-color-brand-purple-1000)] leading-[100%] tracking-[var(--h05-heading05-letter-spacing)]"
              style={{ fontFamily: "Poppins, Helvetica" }}
            >
              Payment Method
            </h2>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                  Full Name
                </label>
                <div className={inputClasses}>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter your personal or work email"
                    className="relative w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                  Country or Region
                </label>
                <div className={inputClasses}>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    placeholder="Enter your personal or work email"
                    className="relative w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                  Address line 1
                </label>
                <div className={inputClasses}>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) =>
                      setFormData({ ...formData, addressLine1: e.target.value })
                    }
                    placeholder="Enter your personal or work email"
                    className="relative w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                  Card Number
                </label>
                <div className={`${inputClasses} pr-4`}>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardNumber: formatCardNumber(e.target.value),
                      })
                    }
                    placeholder="1234 1234 1234"
                    maxLength={19}
                    className="relative flex-1 bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
                  />
                  <div className="flex-shrink-0 w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    Expiry Date
                  </label>
                  <div className={inputClasses}>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expiryDate: formatExpiryDate(e.target.value),
                        })
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                      className="relative w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    Security Code
                  </label>
                  <div className={inputClasses}>
                    <input
                      type="text"
                      name="securityCode"
                      value={formData.securityCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          securityCode: e.target.value,
                        })
                      }
                      placeholder="CVC"
                      maxLength={4}
                      className="relative w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-9 w-full">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-[color:var(--tokens-color-border-border-inactive)] text-[color:var(--premitives-color-brand-purple-1000)] focus:ring-[color:var(--premitives-color-brand-purple-1000)] cursor-pointer"
              />
              <label
                htmlFor="agreement"
                className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] cursor-pointer flex-1"
              >
                You agree that midora will charge your card annually in the
                services it is providing.
              </label>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="px-4 mt-9">
            <button
              onClick={() => console.log("Checkout clicked")}
              className="w-full flex items-center justify-center gap-2 h-[54px] p-4 bg-[color:var(--premitives-color-brand-purple-1000)] rounded-xl hover:opacity-90 transition-all cursor-pointer"
            >
              <span className="relative w-fit font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-white text-[length:var(--h05-heading05-font-size)] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
                Check Out
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex  items-start justify-end px-4">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[color:var(--tokens-color-surface-surface-secondary)] transition-colors"
          aria-label="Menu"
        >
          <MoreOptions
            className="w-5 h-5"
            color="var(--tokens-color-text-text-primary)"
          />
        </button>
      </div>
    </div>
  );
};
