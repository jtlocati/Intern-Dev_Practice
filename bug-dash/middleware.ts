//NOTE: Temporary fix for a faulty endpoint causeing a mismatch on a dependency for nextauth

import { Session } from "inspector/promises";
import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest){
  const Cookiemonster  = request.cookies.get("auth.session-token") ?? request.cookies.get("__Secure-authjs.session-token")

  if (!Cookiemonster){
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*","/projects/:path*", "/issues/:path*", "/users/:path*", "/settings/:path*",]
}


/*export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*", "/issues/:path*", "/users/:path*", "/settings/:path*"],
};*/
