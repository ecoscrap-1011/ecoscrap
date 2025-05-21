import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@/lib/userRole'; 

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/' || 
                       path === '/auth/signin' || 
                       path === '/auth/signup' || 
                       path.startsWith('/api/public') ||
                       path.startsWith('/_next') || 
                       path.includes('.');

  // Check for token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  
  // Redirect logic for public routes
  if (isPublicPath) {
    if (isAuthenticated) {
      if (path === '/auth/signin' || path === '/auth/signup') {
        // Redirect authenticated users trying to access login/signup to their dashboard
        return redirectToDashboard(token.role as UserRole);
      }
    }
    return NextResponse.next();
  }

  // Protected route logic
  if (!isAuthenticated) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Role-based access control
  const userRole = token.role as UserRole;

  // Admin routes protection
  if (path.startsWith('/admin') && userRole !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Staff routes protection
  if (path.startsWith('/staff') && userRole !== UserRole.STAFF) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // User routes protection
  if (path.startsWith('/user') && userRole !== UserRole.SELLER) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // API route protection
  if (path.startsWith('/api/admin') && userRole !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (path.startsWith('/api/staff') && userRole !== UserRole.STAFF) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (path.startsWith('/api/user') && userRole !== UserRole.SELLER) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

function redirectToDashboard(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    case UserRole.STAFF:
      return NextResponse.redirect(new URL('/staff', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    case UserRole.SELLER:
    default:
      return NextResponse.redirect(new URL('/user', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};