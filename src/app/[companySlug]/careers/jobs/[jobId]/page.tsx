import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
    params: Promise<{
        companySlug: string
        jobId: string
    }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { jobId } = await params

    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { company: true },
    })

    if (!job) {
        return {
            title: 'Job Not Found',
        }
    }

    return {
        title: `${job.title} at ${job.company.name} | ${job.location}`,
        description: `Join ${job.company.name} as a ${job.title} in ${job.location}. ${job.jobType} position in ${job.department || 'our team'}.`,
        openGraph: {
            title: `${job.title} at ${job.company.name}`,
            description: `${job.location} • ${job.jobType}`,
            images: job.company.logoUrl ? [job.company.logoUrl] : [],
        },
    }
}

export default async function JobDetailsPage({ params }: PageProps) {
    const { companySlug, jobId } = await params

    // Fetch job with company data
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            company: true,
        },
    })

    // If job doesn't exist or doesn't belong to this company
    if (!job || job.company.slug !== companySlug) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6"
                style={{ backgroundColor: job.company.themeColor || '#4F46E5' }}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={`/${companySlug}/careers`}
                        className="text-white/80 hover:text-white mb-4 inline-flex items-center"
                    >
                        ← Back to {job.company.name} Careers
                    </Link>

                    {job.company.logoUrl && (
                        <img
                            src={job.company.logoUrl}
                            alt={`${job.company.name} logo`}
                            className="h-12 mt-4"
                        />
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Job Header */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {job.title}
                    </h1>

                    <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                        <span className="flex items-center">
                            <span className="mr-2">📍</span>
                            {job.location}
                        </span>
                        <span className="flex items-center">
                            <span className="mr-2">💼</span>
                            {job.jobType}
                        </span>
                        {job.department && (
                            <span className="flex items-center">
                                <span className="mr-2">🏢</span>
                                {job.department}
                            </span>
                        )}
                        <span className="flex items-center">
                            <span className="mr-2">📅</span>
                            Posted {new Date(job.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>

                    {/* Apply Button */}
                    <button
                        className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                        style={{ backgroundColor: job.company.themeColor || '#4F46E5' }}
                    >
                        Apply for this position
                    </button>
                </div>

                {/* Job Description */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{
                            __html: job.description
                                .replace(/^### /gm, '<h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">')
                                .replace(/<\/h3>/g, '</h3>')
                                .replace(/^## /gm, '<h2 class="text-3xl font-bold text-gray-900 mt-10 mb-6">')
                                .replace(/<\/h2>/g, '</h2>')
                                .replace(/^- /gm, '<li class="ml-6">')
                                .replace(/<\/li>/g, '</li>')
                                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
                                .replace(/^(.+)$/gm, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>')
                        }}
                    />
                </div>

                {/* Apply Section */}
                <div className="mt-8 bg-indigo-50 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Ready to join {job.company.name}?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        We're excited to hear from you!
                    </p>
                    <button
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                        style={{ backgroundColor: job.company.themeColor || '#4F46E5' }}
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    )
}
