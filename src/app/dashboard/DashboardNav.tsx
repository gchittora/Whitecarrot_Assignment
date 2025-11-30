'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Session } from 'next-auth'

interface DashboardNavProps {
    session: Session
}

export default function DashboardNav({ session }: DashboardNavProps) {
    const pathname = usePathname()

    const navItems = [
        { href: '/dashboard', label: 'Overview' },
        { href: '/dashboard/jobs', label: 'Jobs' },
        { href: '/dashboard/page-builder', label: 'Page Builder' },
        { href: '/dashboard/settings', label: 'Settings' },
    ]

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login' })
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side - Logo and nav */}
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
                                Careers Builder
                            </Link>
                        </div>

                        {/* Navigation */}
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right side - User menu */}
                    <div className="flex items-center space-x-4">
                        {/* View careers page link */}
                        <Link
                            href={`/${session.user.companySlug}/careers`}
                            target="_blank"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            View Careers Page →
                        </Link>

                        {/* User info */}
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {session.user.name}
                                </p>
                                <p className="text-xs text-gray-500">{session.user.email}</p>
                            </div>

                            {/* Sign out button */}
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile navigation */}
                <div className="sm:hidden pb-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-3 py-2 text-base font-medium rounded-md ${isActive
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
