/**
 * Invoice API types
 */

export interface Invoice {
  uuid: string
  encoded_uuid: string
  file_name: string
  file_path: string
  storage_type: string
  type: string
  created_at: string
  updated_at: string
  subscription_id?: number
  subscription_uuid?: string
  billing_cycle?: string
  plan_name?: string
  amount?: number
  invoice_subscription_uuid?: string
}

