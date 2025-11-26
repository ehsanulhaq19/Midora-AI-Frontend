'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans'
import { subscriptionPlansApi } from '@/api/subscription-plans/api'
import { SubscriptionCheckoutRequest } from '@/api/subscription-plans/types'
import { PrimaryButton } from '@/components/ui/buttons/primary-button'
import { EmailInput } from '@/components/ui/inputs/email-input'
import { useToast } from '@/hooks/use-toast'
import { handleApiError } from '@/lib/error-handler'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface CheckoutFormProps {
  plan: any
  billingCycle: 'monthly' | 'annual'
  onBillingCycleChange: (cycle: 'monthly' | 'annual') => void
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ plan, billingCycle, onBillingCycleChange }) => {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const { success: showSuccessToast, error: showErrorToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    country: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const price = billingCycle === 'monthly' ? plan.monthly_price : plan.annual_price
  const effectiveMonthlyPrice = billingCycle === 'annual' ? (plan.annual_price / 12) : plan.monthly_price
  const savings = billingCycle === 'annual' ? ((plan.monthly_price * 12) - plan.annual_price) : 0
  const savingsPercent = savings > 0 ? Math.round((savings / (plan.monthly_price * 12)) * 100) : 0

  // Calculate renewal date (1 year from now for annual, 1 month for monthly)
  const renewalDate = new Date()
  if (billingCycle === 'annual') {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1)
  } else {
    renewalDate.setMonth(renewalDate.getMonth() + 1)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    if (!formData.address_line_1.trim()) newErrors.address_line_1 = 'Address is required'
    if (!agreedToTerms) newErrors.terms = 'You must agree to the terms'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (!stripe || !elements) {
      showErrorToast('Stripe not loaded', 'Please wait for payment system to load')
      return
    }

    setLoading(true)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
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
        throw new Error(pmError?.message || 'Failed to create payment method')
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
      }

      // Call checkout API
      const response = await subscriptionPlansApi.checkout(checkoutData)

      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'CHECKOUT_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }

      showSuccessToast('Subscription Created', 'Your subscription has been successfully created!')
      router.push('/dashboard')
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Checkout Failed', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
          <button className="text-gray-600 hover:text-gray-900" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Plan Selection and Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Cycle Selection */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onBillingCycleChange('monthly')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    billingCycle === 'monthly'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      billingCycle === 'monthly' ? 'border-purple-600' : 'border-gray-300'
                    }`}>
                      {billingCycle === 'monthly' && (
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                      )}
                    </div>
                    <span className="font-medium">Monthly</span>
                  </div>
                  <p className="text-sm text-gray-600">${plan.monthly_price.toFixed(2)}/month + Tax</p>
                </button>

                <button
                  onClick={() => onBillingCycleChange('annual')}
                  className={`p-4 rounded-lg border-2 transition-all relative ${
                    billingCycle === 'annual'
                      ? 'border-purple-600 bg-purple-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {savingsPercent > 0 && (
                    <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                      Save {savingsPercent}%
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      billingCycle === 'annual' ? 'border-purple-600' : 'border-gray-300'
                    }`}>
                      {billingCycle === 'annual' && (
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                      )}
                    </div>
                    <span className="font-medium">Yearly</span>
                  </div>
                  <p className="text-sm text-gray-600">${effectiveMonthlyPrice.toFixed(2)}/month + Tax</p>
                </button>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{plan.name} / {billingCycle === 'annual' ? 'Annually' : 'Monthly'}</span>
                  <span className="font-medium">${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Total due today</span>
                  <span className="font-semibold text-lg">${price.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-orange-800">
                  Your subscription will automatically renew on {renewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}. 
                  You will be charged ${billingCycle === 'annual' ? plan.annual_price.toFixed(2) + '/year' : plan.monthly_price.toFixed(2) + '/month'} + tax.
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <EmailInput
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    placeholder="Enter your personal or work email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country or Region</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your country"
                  />
                  {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address line 1</label>
                  <input
                    type="text"
                    value={formData.address_line_1}
                    onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your address"
                  />
                  {errors.address_line_1 && <p className="mt-1 text-sm text-red-600">{errors.address_line_1}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <div className="w-full min-h-[54px] px-4 py-3 border border-gray-300 rounded-lg">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#9e2146',
                          },
                        },
                        hidePostalCode: true,
                      }}
                    />
                  </div>
                </div>


                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    You agree that midora will charge your card {billingCycle === 'annual' ? 'annually' : 'monthly'} in the services it is providing.
                  </label>
                </div>
                {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

                <PrimaryButton
                  text="Check Out"
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading || !stripe || !elements}
                  className="w-full"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { plans, selectedPlan, getPlanByUuid, selectPlan, loadPlans } = useSubscriptionPlans()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [plan, setPlan] = useState<any>(null)
  const hasLoadedPlansRef = useRef(false)
  const hasSetPlanRef = useRef(false)

  // Load plans only once
  useEffect(() => {
    if (!hasLoadedPlansRef.current && plans.length === 0) {
      hasLoadedPlansRef.current = true
      loadPlans(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set plan only once when plans are loaded
  useEffect(() => {
    // Don't set plan if we've already set it
    if (hasSetPlanRef.current) {
      return
    }

    // Wait for plans to be loaded
    if (plans.length === 0) {
      return
    }

    const planUuid = searchParams.get('plan')
    let planToSet = null
    
    if (planUuid) {
      // Try to find plan by UUID from plans array
      planToSet = plans.find(p => p.uuid === planUuid)
    } else if (selectedPlan) {
      // Use selected plan if no UUID in URL
      planToSet = selectedPlan
    } else if (plans.length > 0) {
      // Fallback to first plan
      planToSet = plans[0]
    }
    
    if (planToSet) {
      hasSetPlanRef.current = true
      setPlan(planToSet)
      // Only update selectedPlan if it's different to avoid triggering re-renders
      if (!selectedPlan || selectedPlan.uuid !== planToSet.uuid) {
        selectPlan(planToSet)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans, searchParams]) // Removed selectedPlan and selectPlan from dependencies to prevent loops

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan details...</p>
        </div>
      </div>
    )
  }

  const stripeOptions: StripeElementsOptions = {
    mode: 'payment',
    amount: billingCycle === 'monthly' ? Math.round(plan.monthly_price * 100) : Math.round(plan.annual_price * 100),
    currency: 'usd',
  }

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <CheckoutForm plan={plan} billingCycle={billingCycle} onBillingCycleChange={setBillingCycle} />
    </Elements>
  )
}

