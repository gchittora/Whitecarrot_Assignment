import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
    const session = await auth()

    if (!session) {
        return null
    }

    // Fetch company data and stats
    const company = await prisma.company.findUnique({
        where: { id: session.user.companyId },
        include: {
            jobs: {
                where: { isActive: true },
            },
            _count: {
                select: {
                    jobs: true,
                    pageSections: true,
                },
            },
        },
    })

    if (!company) {
        return <div>Company not found</div>
    }

    const stats = [
        {
            label: 'Total Jobs',
            value: company._count.jobs,
            icon: '💼',
            href: '/dashboard/jobs',
        },
        {
            label: 'Active Jobs',
            value: company.jobs.length,
            icon: '✅',
            href: '/dashboard/jobs',
        },
        {
            label: 'Page Sections',
            value: company._count.pageSections,
            icon: '📄',
            href: '/dashboard/page-builder',
        },
        {
            label: 'Company Slug',
            value: company.slug,
            icon: '🔗',
            href: `/${company.slug}`,
        },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {session.user.name}!
                </h1>
                <p className="mt-2 text-gray-600">
                    Here's an overview of your careers page
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                            <div className="text-4xl">{stat.icon}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/dashboard/jobs?action=create"
                        className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                        <div>
                            <p className="font-medium text-gray-900">Create New Job</p>
                            <p className="text-sm text-gray-500">Post a new position</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/page-builder"
                        className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                        <div>
                            <p className="font-medium text-gray-900">Edit Page Sections</p>
                            <p className="text-sm text-gray-500">Customize your page</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                        <div>
                            <p className="font-medium text-gray-900">Company Settings</p>
                            <p className="text-sm text-gray-500">Update your info</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
                    <Link
                        href="/dashboard/jobs"
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        View all →
                    </Link>
                </div>

                {company.jobs.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No jobs posted yet</p>
                        <Link
                            href="/dashboard/jobs?action=create"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Create your first job
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {company.jobs.slice(0, 5).map((job) => (
                            <div
                                key={job.id}
                                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {job.location} • {job.jobType}
                                    </p>
                                </div>
                                <Link
                                    href={`/dashboard/jobs/${job.id}`}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Edit →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
