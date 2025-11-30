import { auth } from "@/auth"
import { redirect } from "next/navigation"
import JobForm from "../JobForm"

export default async function CreateJobPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
                <p className="mt-2 text-gray-600">
                    Fill in the details to post a new job opening
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <JobForm companyId={session.user.companyId} />
            </div>
        </div>
    )
}
