//middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();

  // permitir login siempre
  if (pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`)) {
    return NextResponse.next();
  }

  const role = req.cookies.get("js_role")?.value;

  if (role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("unauthorized", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
