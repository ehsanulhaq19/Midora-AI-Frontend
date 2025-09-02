import { Button } from './Button'

export function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto">
            Join thousands of developers who are already building amazing applications with our modern tech stack. 
            Start your journey today and experience the power of Next.js, TypeScript, and Tailwind CSS.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Start Building
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              View Documentation
            </Button>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-primary-100 text-sm">
              Open source • MIT License • Built with ❤️ by the Midora AI Team
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
