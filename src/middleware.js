import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, AUTH_SESSION_COOKIE_NAME } from "@/lib/auth";

const publicPaths = ["/", "/login", "/signup", "/register"];
const protectedPaths = ["/dashboard", "/profile", "/quotation", "/customer", "/invoice"];
const routeAliases = {
  "/quations": "/quotation/view",
  "/customers": "/customer",
  "/quotations": "/quotation/view",
  "/profiles": "/profile",
};

function isPathMatch(pathname, paths) {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (routeAliases[pathname]) {
    return NextResponse.redirect(new URL(routeAliases[pathname], request.url));
  }

  if (isPathMatch(pathname, publicPaths)) {
    const hasSession = request.cookies.has(AUTH_COOKIE_NAME) || request.cookies.has(AUTH_SESSION_COOKIE_NAME);

    if (pathname === "/login" && hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (isPathMatch(pathname, protectedPaths)) {
    const hasSession = request.cookies.has(AUTH_COOKIE_NAME) || request.cookies.has(AUTH_SESSION_COOKIE_NAME);

    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
