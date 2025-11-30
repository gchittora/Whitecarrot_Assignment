'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface PreviewBannerProps {
    companyId: string
}

export default function PreviewBanner({ companyId }: PreviewBannerProps) {
    const { data: session } = useSession()

    // Only show banner if user is logged in and viewing their own company
    if (!session || session.user.companyId !== companyId) {
        return null
    }

    return (
        <div className="bg-indigo-600 text-white py-3 px-4 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div>
                        <p className="font-semibold">Preview Mode</p>
                        <p className="text-sm text-indigo-100">
                            You're viewing your careers page as it appears to candidates
                        </p>
                    </div>
                </div>
                <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}
