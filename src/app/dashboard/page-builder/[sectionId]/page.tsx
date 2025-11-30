import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import SectionForm from "../SectionForm"

interface PageProps {
    params: Promise<{
        sectionId: string
    }>
}

export default async function EditSectionPage({ params }: PageProps) {
    const session = await auth()
    const { sectionId } = await params

    if (!session) {
        redirect("/login")
    }

    const section = await prisma.pageSection.findUnique({
        where: { id: sectionId },
    })

    if (!section || section.companyId !== session.user.companyId) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Section</h1>
                <p className="mt-2 text-gray-600">
                    Update the section details below
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <SectionForm
                    section={{
                        id: section.id,
                        sectionType: section.sectionType,
                        title: section.title,
                        content: section.content,
                        order: section.order,
                        isVisible: section.isVisible,
                    }}
                    companyId={session.user.companyId}
                />
            </div>
        </div>
    )
}
