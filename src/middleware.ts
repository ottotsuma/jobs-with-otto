// import { NextRequest, NextResponse } from "next/server";
// import { languages, defaultLanguage } from "@/i18n/settings";

// export function middleware(req: NextRequest) {
//     const { pathname } = req.nextUrl;

//     // Exclude static assets like manifest.json, icons, and fetch.ts
//     if (pathname === '/manifest.json' || pathname === '/apple-touch-icon.png' || pathname === '/icon-192x192.png' || pathname.startsWith('/src/lib/')) {
//         return NextResponse.next();
//     }

//     // If the request is for static assets (images, css, js), do nothing
//     if (pathname.startsWith('/_next/') || pathname.startsWith('/static') || pathname.endsWith('.svg')) {
//         return NextResponse.next();
//     }

//     const locale = pathname.split("/")[1];

//     // Redirect if no locale is in the URL
//     if (!languages.includes(locale)) {
//         return NextResponse.redirect(new URL(`/${defaultLanguage}${pathname}`, req.url));
//     }

//     return NextResponse.next();
// }
