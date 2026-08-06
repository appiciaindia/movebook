import { NextResponse } from "next/server";
import { jwtVerify } from "jose";


const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const publicPaths = ["/", "/login", "/signup", "/register"];

const protectedPaths = [
  "/dashboard",
  "/profile",
  "/quotation",
  "/customer",
  "/invoice",
];

const routeAliases = {
  "/quations": "/quotation/view",
  "/customers": "/customer",
  "/quotations": "/quotation/view",
  "/profiles": "/profile",
};

function isPathMatch(pathname, paths) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ignore static files & API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Route aliases
  if (routeAliases[pathname]) {
    return NextResponse.redirect(
      new URL(routeAliases[pathname], request.url)
    );
  }

  
  // JWT Cookie
  const token = request.cookies.get("access_token")?.value;

  let user = null;

  if (token) {
    user = await verifyToken(token);
  }

  // register Routes
  // Force register page until profile is completed
  

  // Public Routes
  if (isPathMatch(pathname, publicPaths)) {
    if (pathname === "/login" && user) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    return NextResponse.next();
  }

  // Protected Routes
  if (isPathMatch(pathname, protectedPaths)) {
    if (!user) {
      const response = NextResponse.redirect(
        new URL("/login", request.url)
      );

      response.cookies.delete("access_token");

      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}



export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};