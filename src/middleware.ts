import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname starts with locale (ar or en)
  const localeMatch = pathname.match(/^\/(ar|en)(\/|$)/);

  if (localeMatch) {
    const locale = localeMatch[1] as "ar" | "en";

    // Remove locale from pathname
    const newPathname = pathname.replace(`/${locale}`, "") || "/";

    // Clone the URL and update pathname
    const url = request.nextUrl.clone();
    url.pathname = newPathname;

    // Create response with redirect
    const response = NextResponse.redirect(url);

    // Set locale cookie
    response.cookies.set({
      name: "locale",
      value: locale,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
