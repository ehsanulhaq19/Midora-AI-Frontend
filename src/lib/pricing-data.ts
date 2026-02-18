/**
 * Pricing plans data configuration
 */

import { PricingSectionData } from '@/types/pricing'
import { t } from '@/i18n'
import { pricing as pricingTranslations } from '@/i18n/languages/en/pricing'

// Helper function to get features array from i18n
const getFeatures = (planKey: keyof typeof pricingTranslations.plans) => {
  return pricingTranslations.plans[planKey].features.map((text: string) => ({ text }))
}

export const pricingData: PricingSectionData = {
  title: t('pricing.title'),
  subtitle: t('pricing.subtitle'),
  plans: [
    {
      id: 'lite',
      name: t('pricing.plans.lite.name'),
      description: t('pricing.plans.lite.description'),
      price: 15,
      currency: '$',
      period: '/month',
      features: getFeatures('lite'),
      isPopular: true
    },
    {
      id: 'core',
      name: t('pricing.plans.core.name'),
      description: t('pricing.plans.core.description'),
      price: 29,
      currency: '$',
      period: '/month',
      features: getFeatures('core')
    },
    {
      id: 'power',
      name: t('pricing.plans.power.name'),
      description: t('pricing.plans.power.description'),
      price: 49,
      currency: '$',
      period: '/month',
      features: getFeatures('power')
    },
    {
      id: 'power-plus',
      name: t('pricing.plans.powerPlus.name'),
      description: t('pricing.plans.powerPlus.description'),
      price: 49,
      currency: '$',
      period: '/month',
      features: getFeatures('powerPlus')
    },
    {
      id: 'custom',
      name: t('pricing.plans.custom.name'),
      description: t('pricing.plans.custom.description'),
      price: 69,
      currency: '$',
      period: '/month',
      features: getFeatures('custom'),
      isCustom: true
    }
  ]
}
