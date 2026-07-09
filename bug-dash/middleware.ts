export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*", "/issues/:path*", "/users/:path*", "/settings/:path*"],
};
