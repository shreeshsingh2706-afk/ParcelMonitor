import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req as typeof req & { auth: { user?: unknown } | null };
  const isLoggedIn = !!session?.user;

  const isProtected =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/orders") ||
    nextUrl.pathname.startsWith("/tracking") ||
    nextUrl.pathname.startsWith("/settings") ||
    nextUrl.pathname.startsWith("/analytics");

  // Redirect unauthenticated users to login
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect logged-in users away from login page
  if (isLoggedIn && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
