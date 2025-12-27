'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Close } from '@/icons'
import { t } from '@/i18n'
import { ActionButton } from '@/components/ui/buttons'
import { useToast } from '@/hooks/use-toast'
import { handleApiError } from '@/lib/error-handler'
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { userPaymentMethodsApi } from '@/api/user-payment-methods/api'

// Load Stripe only once - memoized at module level
const stripePromise = typeof window !== 'undefined'
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")
  : Promise.resolve(null)

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
].sort((a, b) => a.name.localeCompare(b.name))

interface AddPaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface AddPaymentMethodFormProps {
  onClose: () => void
  onSuccess: () => void
}

const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({ onClose, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { success: showSuccessToast, error: showErrorToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    country: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}
    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format"
    if (!formData.country.trim()) newErrors.country = "Country is required"
    if (!formData.address_line_1.trim())
      newErrors.address_line_1 = "Address is required"

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    if (!stripe || !elements) {
      showErrorToast(
        "Stripe not loaded",
        "Please wait for payment system to load"
      )
      return
    }

    setLoading(true)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error("Card element not found")
      }

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
        })

      if (pmError || !paymentMethod) {
        throw new Error(pmError?.message || "Failed to create payment method")
      }

      const response = await userPaymentMethodsApi.createPaymentMethod({
        payment_method_id: paymentMethod.id,
        full_name: formData.full_name,
        email: formData.email,
        country: formData.country,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2 || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        postal_code: formData.postal_code || undefined,
      })

      if (response.error) {
        const errorMessage = handleApiError(response.processedError || response)
        showErrorToast("Failed to add payment method", errorMessage)
      } else {
        showSuccessToast("Success", "Payment method added successfully")
        onSuccess()
        onClose()
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast("Failed to add payment method", errorMessage)
    } finally {
      setLoading(false)
    }
  }, [stripe, elements, formData, onClose, onSuccess, showErrorToast, showSuccessToast])

  const inputClasses = useMemo(
    () =>
      "flex h-[54px] items-center gap-3 relative self-stretch w-full rounded-xl border border-solid border-[#dbdbdb] bg-transparent transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:border-blue-500",
    []
  )

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      }
      return prev
    })
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2 w-full">
        <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          Full Name
        </label>
        <div className={inputClasses}>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder="Enter your full name"
            className="relative w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
          />
        </div>
        {errors.full_name && (
          <p className="text-sm text-red-500">{errors.full_name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          Email
        </label>
        <div className={inputClasses}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
            className="relative w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          Country
        </label>
        <div className={inputClasses}>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="relative w-full bg-transparent border-none outline-none px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%] cursor-pointer appearance-none"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "2.5rem",
            }}
          >
            <option value="" disabled>
              Select your country
            </option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        {errors.country && (
          <p className="text-sm text-red-500">{errors.country}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          Address Line 1
        </label>
        <div className={inputClasses}>
          <input
            type="text"
            value={formData.address_line_1}
            onChange={(e) => handleInputChange('address_line_1', e.target.value)}
            placeholder="Enter your address"
            className="relative w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
          />
        </div>
        {errors.address_line_1 && (
          <p className="text-sm text-red-500">{errors.address_line_1}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          Address Line 2 (Optional)
        </label>
        <div className={inputClasses}>
          <input
            type="text"
            value={formData.address_line_2}
            onChange={(e) => handleInputChange('address_line_2', e.target.value)}
            placeholder="Apartment, suite, etc."
            className="relative w-full bg-transparent border-none outline-none placeholder:text-[#A1A1A1] px-6 py-3 font-SF-Pro font-normal text-black text-base tracking-[-0.48px] leading-[100%]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          Card Number
        </label>
        <div className={`${inputClasses} !px-0`}>
          <div className="w-full px-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded-full font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
        >
          {t('account.cancel')}
        </button>
        <ActionButton
          type="submit"
          disabled={loading || !stripe || !elements}
          loading={loading}
          variant="primary"
          size="sm"
        >
          {loading ? "Adding..." : "Add Payment Method"}
        </ActionButton>
      </div>
    </form>
  )
}

AddPaymentMethodForm.displayName = 'AddPaymentMethodForm'

// Memoized Elements wrapper to prevent unnecessary re-renders
const StripeElementsWrapper: React.FC<{ onClose: () => void; onSuccess: () => void }> = React.memo(({ onClose, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <AddPaymentMethodForm onClose={onClose} onSuccess={onSuccess} />
    </Elements>
  )
})

StripeElementsWrapper.displayName = 'StripeElementsWrapper'

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [stripeReady, setStripeReady] = useState(false)
  const previousOverflowRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      // Reset stripe ready state when modal closes
      setStripeReady(false)
      return
    }

    // Store the current overflow value before changing it
    previousOverflowRef.current = document.body.style.overflow || 'unset'
    document.body.style.overflow = 'hidden'
    
    // Preload Stripe when modal opens
    let mounted = true
    if (stripePromise) {
      stripePromise
        .then((stripe) => {
          if (mounted && stripe) {
            setStripeReady(true)
          }
        })
        .catch((error) => {
          console.error('Failed to load Stripe:', error)
          if (mounted) {
            setStripeReady(false)
          }
        })
    } else {
      setStripeReady(false)
    }

    return () => {
      mounted = false
      // Restore previous overflow value instead of always setting to 'unset'
      if (previousOverflowRef.current !== null) {
        document.body.style.overflow = previousOverflowRef.current
        previousOverflowRef.current = null
      } else {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-payment-method-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div
        className="relative bg-[color:var(--tokens-color-surface-surface-primary)] rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--tokens-color-border-border-subtle)]">
          <h2 id="add-payment-method-title" className="text-lg font-h02-heading02 text-[color:var(--tokens-color-text-text-primary)]">
            {t('account.paymentMethods.addTitle')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
            aria-label="Close"
          >
            <Close
              className="w-5 h-5"
              color="var(--tokens-color-text-text-primary)"
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {!stripeReady ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-[color:var(--tokens-color-text-text-inactive-2)]">
                Loading payment form...
              </span>
            </div>
          ) : (
            <StripeElementsWrapper onClose={onClose} onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </div>
  )
}

AddPaymentMethodModal.displayName = 'AddPaymentMethodModal'

