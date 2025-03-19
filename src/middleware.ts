import { NextRequest, NextResponse } from "next/server";
import { languages, defaultLanguage } from "./src/i18n/settings";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const locale = pathname.split("/")[1];

    // Redirect if no locale is in the URL
    if (!languages.includes(locale)) {
        return NextResponse.redirect(new URL(`/${defaultLanguage}${pathname}`, req.url));
    }

    return NextResponse.next();
}

// Apply middleware to all pages
export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
