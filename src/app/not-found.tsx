import { NotFoundDisplay } from '@/components/ui/NotFoundDisplay'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <NotFoundDisplay 
        title="Page Not Found"
        message="The page you're looking for doesn't exist."
        backUrl="/"
      />
    </div>
  )
}
