import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    if (token) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    } else {

      const landingUrl = new URL("/landing", request.url);
      return NextResponse.redirect(landingUrl);
    }
  }


  const protectedRoutes = ["/dashboard", "/profile"];
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const landingUrl = new URL("/landing", request.url);
    return NextResponse.redirect(landingUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/profile/:path*", "/landing"],
};
