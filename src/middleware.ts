import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
    const isOnLogin = req.nextUrl.pathname.startsWith("/login")
    const isOnSignup = req.nextUrl.pathname.startsWith("/signup")

    // Redirect to login if trying to access dashboard without auth
    if (isOnDashboard && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redirect to dashboard if already logged in and trying to access login/signup
    if ((isOnLogin || isOnSignup) && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
}
