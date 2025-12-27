/**
 * Subscription Plans API types
 */

export interface SubscriptionPlan {
  uuid: string
  name: string
  slug: string
  description?: string
  currency?: string
  monthly_price: number
  annual_price: number
  credits_per_month: number
  file_storage_gb: number
  vector_storage_entries: number
  message_history_days: number | null
  priority_support: boolean
  api_access: string
  team_user_limit: number | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface AiModelEstimate {
  uuid: string
  ai_model: {
    uuid: string
    model_name: string
    api_model_name: string
    provider: string
  }
  credits_per_million: number
  plan_id: number
}

export interface SubscriptionCheckoutRequest {
  plan_uuid: string
  billing_cycle: 'monthly' | 'annual'
  full_name: string
  email: string
  country: string
  address_line_1: string
  address_line_2?: string
  city?: string
  state?: string
  postal_code?: string
  payment_method_id?: string
  user_payment_method_uuid?: string
  stripe_customer_id?: string
}

export interface SubscriptionCheckoutResponse {
  success: boolean
  message: string
  subscription: {
    uuid: string
    user_id: number
    plan_id: number
    status: string
    billing_cycle: string
    current_period_start: string
    current_period_end: string
    cancel_at_period_end: boolean
    canceled_at?: string
    stripe_subscription_id?: string
    stripe_customer_id?: string
    created_at: string
    updated_at: string
    plan?: SubscriptionPlan
  }
}

export interface ActiveSubscription {
  uuid: string
  user_id: number
  plan_id: number
  status: string
  billing_cycle: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at?: string
  stripe_subscription_id?: string
  stripe_customer_id?: string
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
}

