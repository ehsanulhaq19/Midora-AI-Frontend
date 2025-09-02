import { WelcomeHero } from '@/components/ui/WelcomeHero'
import { FeatureGrid } from '@/components/ui/FeatureGrid'
import { CallToAction } from '@/components/ui/CallToAction'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <WelcomeHero />
      <FeatureGrid />
      <CallToAction />
    </main>
  )
}
