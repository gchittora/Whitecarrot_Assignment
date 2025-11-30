import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function PageBuilderPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    // Fetch all page sections for this company
    const sections = await prisma.pageSection.findMany({
        where: {
            companyId: session.user.companyId,
        },
        orderBy: {
            order: "asc",
        },
    })

    const sectionTypeLabels: Record<string, string> = {
        about_us: "About Us",
        life_at_company: "Life at Company",
        benefits: "Benefits & Perks",
        values: "Company Values",
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Page Builder</h1>
                    <p className="mt-2 text-gray-600">
                        Customize the sections on your careers page ({sections.length} sections)
                    </p>
                </div>
                <Link
                    href="/dashboard/page-builder/create"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                    Add New Section
                </Link>
            </div>

            {/* Preview Link */}
            <div className="mb-6">
                <Link
                    href={`/${session.user.companySlug}/careers`}
                    target="_blank"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    Preview your careers page →
                </Link>
            </div>

            {/* Sections List */}
            {sections.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        No sections yet
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Create your first page section to customize your careers page
                    </p>
                    <Link
                        href="/dashboard/page-builder/create"
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                    >
                        Create Your First Section
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {sections.map((section) => {
                        const content = JSON.parse(section.content)

                        return (
                            <div
                                key={section.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {section.title}
                                            </h3>
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                                {sectionTypeLabels[section.sectionType] || section.sectionType}
                                            </span>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${section.isVisible
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {section.isVisible ? "Visible" : "Hidden"}
                                            </span>
                                        </div>

                                        {/* Preview content */}
                                        <div className="text-sm text-gray-600 mt-2">
                                            {content.text && (
                                                <p className="line-clamp-2">{content.text}</p>
                                            )}
                                            {content.benefits && (
                                                <p className="text-gray-500">
                                                    {content.benefits.length} benefits listed
                                                </p>
                                            )}
                                            {content.values && (
                                                <p className="text-gray-500">
                                                    {content.values.length} values listed
                                                </p>
                                            )}
                                            {content.highlights && (
                                                <p className="text-gray-500">
                                                    {content.highlights.length} highlights
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-2 text-xs text-gray-500">
                                            Order: {section.order}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3 ml-4">
                                        <Link
                                            href={`/dashboard/page-builder/${section.id}`}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Help Text */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Sections are displayed in order on your careers page</li>
                    <li>• Use "Hidden" to temporarily remove a section without deleting it</li>
                    <li>• Preview your changes by visiting your careers page</li>
                    <li>• Different section types support different content formats</li>
                </ul>
            </div>
        </div>
    )
}
