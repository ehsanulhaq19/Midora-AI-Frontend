import { WelcomeStepProps } from '@/types/chat'

export default function WelcomeStep({ step, index, currentStep }: WelcomeStepProps) {
  const isActive = index <= currentStep

  return (
    <div
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-700 ease-out
        ${isActive 
          ? 'border-primary-200 bg-white shadow-lg shadow-primary-100 animate-slide-up' 
          : 'border-neutral-200 bg-neutral-50 opacity-30 scale-95 translate-y-5'
        }
      `}
      style={{
        animationDelay: `${step.delay}ms`,
        animationFillMode: 'both'
      }}
    >
      {/* Step Number */}
      <div className={`
        absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500
        ${isActive 
          ? 'bg-primary-500 text-white' 
          : 'bg-neutral-300 text-neutral-600'
        }
      `}>
        {step.id}
      </div>

      {/* Icon */}
      <div className="text-4xl mb-4">{step.icon}</div>

      {/* Content */}
      <h3 className={`
        text-xl font-semibold mb-2 transition-colors duration-500
        ${isActive ? 'text-neutral-900' : 'text-neutral-500'}
      `}>
        {step.title}
      </h3>
      <p className={`
        text-sm leading-relaxed transition-colors duration-500
        ${isActive ? 'text-neutral-600' : 'text-neutral-400'}
      `}>
        {step.description}
      </p>

      {/* Progress Indicator */}
      {isActive && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-b-2xl animate-progress-bar"
          style={{
            animationDelay: `${step.delay + 500}ms`
          }}
        />
      )}
    </div>
  )
}
