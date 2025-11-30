import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            companyId: string
            companySlug: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        companyId: string
        companySlug: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        companyId: string
        companySlug: string
    }
}
