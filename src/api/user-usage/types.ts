/**
 * User Usage API Types
 * Type definitions for user usage and credits API responses
 */

export interface SubscriptionPlanDetails {
  uuid: string;
  encoded_uuid: string;
  name: string;
  slug: string;
  monthly_price: number;
  annual_price: number;
  credits_per_month: number;
  file_storage_gb: number;
  vector_storage_entries: number;
  message_history_days: number | null;
  priority_support: boolean;
  api_access: string;
  team_user_limit: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreditsAndSubscriptionInfo {
  available_credits: number;
  used_credits: number;
  plan_name: string | null;
  next_billing_date: string | null;
  plan_details: SubscriptionPlanDetails | null;
}

