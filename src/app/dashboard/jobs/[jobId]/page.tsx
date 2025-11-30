import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import JobForm from "../JobForm"

interface PageProps {
    params: Promise<{
        jobId: string
    }>
}

export default async function EditJobPage({ params }: PageProps) {
    const session = await auth()
    const { jobId } = await params

    if (!session) {
        redirect("/login")
    }

    // Fetch job and verify it belongs to this company
    const job = await prisma.job.findUnique({
        where: { id: jobId },
    })

    if (!job || job.companyId !== session.user.companyId) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
                <p className="mt-2 text-gray-600">
                    Update the job details below
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <JobForm
                    job={{
                        id: job.id,
                        title: job.title,
                        description: job.description,
                        location: job.location,
                        jobType: job.jobType,
                        department: job.department || '',
                        isActive: job.isActive,
                    }}
                    companyId={session.user.companyId}
                />
            </div>
        </div>
    )
}
