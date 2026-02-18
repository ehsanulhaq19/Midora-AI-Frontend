/**
 * Pricing plan types and interfaces
 */

export interface PricingFeature {
  text: string
}

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  period: string
  features: PricingFeature[]
  isPopular?: boolean
  isCustom?: boolean
}

export interface PricingSectionData {
  title: string
  subtitle: string
  plans: PricingPlan[]
}
