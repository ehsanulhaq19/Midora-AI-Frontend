import { AuthLandingPage } from '@/components/auth/AuthLandingPage'

export default function ForgotPasswordLoading() {
  return (
    <AuthLandingPage>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">M</span>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Loading...
          </h1>
        </div>
        
        <div className="shadow-lg border-0 bg-white rounded-xl p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    </AuthLandingPage>
  )
}
