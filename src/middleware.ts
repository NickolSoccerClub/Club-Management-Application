import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/committee", "/coach", "/parent"];

export async function middleware(request: NextRequest) {
  // Update the Supabase session (refresh tokens)
  const response = await updateSession(request);

  // Check if route requires auth
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected) {
    // Check for Supabase auth cookies
    const hasSession = request.cookies.getAll().some(
      (cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token")
    );

    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
