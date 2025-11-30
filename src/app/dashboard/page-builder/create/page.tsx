import { auth } from "@/auth"
import { redirect } from "next/navigation"
import SectionForm from "../SectionForm"

export default async function CreateSectionPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Add New Section</h1>
                <p className="mt-2 text-gray-600">
                    Create a new section for your careers page
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <SectionForm companyId={session.user.companyId} />
            </div>
        </div>
    )
}
