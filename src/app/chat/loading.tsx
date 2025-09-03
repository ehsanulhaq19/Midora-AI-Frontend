export default function ChatLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full mx-auto mb-6"></div>
        </div>
        <div className="space-y-3">
          <div className="h-8 bg-primary-200 rounded-lg w-64 mx-auto animate-pulse"></div>
          <div className="h-4 bg-neutral-200 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div className="text-primary-600 text-lg font-medium">
          Preparing your AI experience...
        </div>
      </div>
    </div>
  )
}
