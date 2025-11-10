import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ACCESS_COOKIE = process.env.NEXT_PUBLIC_ACCESS_COOKIE || "access_token";
const REFRESH_COOKIE =
  process.env.NEXT_PUBLIC_REFRESH_COOKIE || "refresh_token";

export function middleware(req: NextRequest) {
  // Jangan halangi /auth (halaman login)
  if (req.nextUrl.pathname.startsWith("/auth")) return NextResponse.next();

  const access = req.cookies.get(ACCESS_COOKIE);
  const refresh = req.cookies.get(REFRESH_COOKIE);

  if (!access && !refresh) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth"; // atau "/login"
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // lindungi semua halaman dashboard
};
