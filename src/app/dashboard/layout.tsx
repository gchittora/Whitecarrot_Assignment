import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardNav from "./DashboardNav"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNav session={session} />
            <main>{children}</main>
        </div>
    )
}
