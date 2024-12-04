import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value || "";
    //get from localstorage
    // const token = localStorage.getItem("accessToken") || "";

    if (req.nextUrl.pathname.startsWith("/dashboard") && !token) {
        console.log("Redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (["/login", "/register"].includes(req.nextUrl.pathname) && token) {
        console.log("Redirecting to dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};