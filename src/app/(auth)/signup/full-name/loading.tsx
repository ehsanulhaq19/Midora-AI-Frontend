export default function Loading() {
  return (
    <div className="relative min-h-screen w-full bg-[color:var(--tokens-color-surface-surface-primary)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
