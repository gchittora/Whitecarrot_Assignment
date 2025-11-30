import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import JobsList from './JobsList'
import PreviewBanner from '@/components/PreviewBanner'
import type { Metadata } from 'next'

// This page shows the public careers page for a company
// URL: /whitecarrot/careers

interface PageProps {
    params: Promise<{
        companySlug: string
    }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { companySlug } = await params

    const company = await prisma.company.findUnique({
        where: { slug: companySlug },
        include: {
            jobs: {
                where: { isActive: true },
            },
        },
    })

    if (!company) {
        return {
            title: 'Company Not Found',
        }
    }

    return {
        title: `Careers at ${company.name} | Join Our Team`,
        description: company.description || `Explore career opportunities at ${company.name}. We're hiring for ${company.jobs.length} open positions.`,
        openGraph: {
            title: `Careers at ${company.name}`,
            description: company.description || `Join our team at ${company.name}`,
            images: company.logoUrl ? [company.logoUrl] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Careers at ${company.name}`,
            description: company.description || `Join our team at ${company.name}`,
        },
    }
}

export default async function CompanyPage({ params }: PageProps) {
    const { companySlug } = await params

    // Fetch company data from database
    const company = await prisma.company.findUnique({
        where: { slug: companySlug },
        include: {
            jobs: {
                where: { isActive: true },
                orderBy: { createdAt: 'desc' },
            },
            pageSections: {
                where: { isVisible: true },
                orderBy: { order: 'asc' },
            },
        },
    })

    // If company doesn't exist, show 404
    if (!company) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Preview Banner for Recruiters */}
            <PreviewBanner companyId={company.id} />

            {/* Hero Section */}
            <div
                className="relative h-96"
                style={{
                    backgroundColor: company.themeColor || '#4F46E5'
                }}
            >
                {/* Banner Image */}
                {company.bannerUrl && (
                    <img
                        src={company.bannerUrl}
                        alt={`${company.name} banner`}
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                )}

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
                    {/* Logo */}
                    {company.logoUrl && (
                        <img
                            src={company.logoUrl}
                            alt={`${company.name} logo`}
                            className="h-16 mb-6"
                        />
                    )}

                    {/* Company Name */}
                    <h1 className="text-5xl font-bold text-white mb-4">
                        {company.name}
                    </h1>

                    {/* Description */}
                    {company.description && (
                        <p className="text-xl text-white/90 max-w-2xl">
                            {company.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Video Section (if exists) */}
                {company.videoUrl && (
                    <div className="mb-12 max-w-4xl mx-auto">
                        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                src={company.videoUrl.replace('watch?v=', 'embed/')}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}

                {/* Page Sections */}
                {company.pageSections.map((section) => {
                    const content = JSON.parse(section.content)

                    return (
                        <section key={section.id} className="mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                {section.title}
                            </h2>

                            {/* About Us / Life at Company */}
                            {(section.sectionType === 'about_us' || section.sectionType === 'life_at_company') && (
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {content.text}
                                    </p>
                                    {content.highlights && (
                                        <ul className="mt-6 space-y-3">
                                            {content.highlights.map((highlight: string, idx: number) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="text-indigo-600 mr-2">✓</span>
                                                    <span className="text-gray-700">{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* Benefits */}
                            {section.sectionType === 'benefits' && content.benefits && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {content.benefits.map((benefit: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                        >
                                            <div className="text-4xl mb-3">{benefit.icon}</div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-gray-600">{benefit.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Values */}
                            {section.sectionType === 'values' && content.values && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {content.values.map((value: any, idx: number) => (
                                        <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {value.title}
                                            </h3>
                                            <p className="text-gray-600">{value.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )
                })}

                {/* Jobs Section - Now with Filters! */}
                <JobsList jobs={company.jobs} companySlug={companySlug} />
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <p className="text-gray-400">
                            © {new Date().getFullYear()} {company.name}. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
