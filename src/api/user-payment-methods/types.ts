/**
 * User Payment Method Types
 */

export interface UserPaymentMethod {
  uuid: string
  user_id: number
  type: string
  card_name: string | null
  last_4_digits: string | null
  saved_card_info: {
    brand?: string
    exp_month?: number
    exp_year?: number
    last4?: string
    country?: string
  } | null
  payment_method_id: string
  provider_type: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

