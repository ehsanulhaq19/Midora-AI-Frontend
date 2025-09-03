import { CompletionMessageProps } from '@/types/chat'

export default function CompletionMessage({ isVisible }: CompletionMessageProps) {
  if (!isVisible) return null

  return (
    <div className="mt-12 p-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl text-white shadow-xl animate-bounce-in">
      <h2 className="text-2xl font-bold mb-2">🎉 Welcome Complete!</h2>
      <p className="text-lg opacity-90">
        You're all set! Our AI features will be launching soon. Stay tuned for an amazing experience.
      </p>
    </div>
  )
}
