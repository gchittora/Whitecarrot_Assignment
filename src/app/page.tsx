import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Careers Page Builder
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create beautiful, branded careers pages for your company. Manage jobs, customize content, and attract top talent.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-lg"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium text-lg"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Example careers page:
          </p>
          <Link
            href="/whitecarrot/careers"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View WhiteCarrot Careers Page
          </Link>
        </div>
      </div>
    </div>
  )
}
