import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SettingsForm from "./SettingsForm"

export default async function SettingsPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    // Fetch company data
    const company = await prisma.company.findUnique({
        where: { id: session.user.companyId },
    })

    if (!company) {
        return <div>Company not found</div>
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
                <p className="mt-2 text-gray-600">
                    Manage your company information and branding
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <SettingsForm company={company} />
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Preview Your Changes</h3>
                <p className="text-sm text-blue-800 mb-3">
                    See how your careers page looks with the current settings
                </p>
                <a
                    href={`/${company.slug}/careers`}
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                    View Careers Page →
                </a>
            </div>
        </div>
    )
}
