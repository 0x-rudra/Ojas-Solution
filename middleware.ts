import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { validateCsrfToken } from '@/lib/csrf';

// Regex to check if path needs CSRF validation (POST, PUT, DELETE requests)
export function middleware(request: NextRequest) {
  const method = request.method;
  
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const headerToken = request.headers.get('x-csrf-token');
    const cookieToken = request.cookies.get('csrf-token')?.value;

    if (!validateCsrfToken(cookieToken, headerToken)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid or missing CSRF token' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
