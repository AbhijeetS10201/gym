import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function proxy(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || "fallback_development_secret_key_12345" 
  });
  
  const { pathname } = req.nextUrl;

  // Paths requiring authentication
  const isDashboardPath = pathname.startsWith('/dashboard');

  // Paths for unauthenticated users only (Auth pages)
  const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isDashboardPath && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register'
  ],
};
