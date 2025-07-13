import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  // Get credentials from environment variables with fallbacks
  const username = process.env.BASIC_AUTH_USER || 'admin';
  const password = process.env.BASIC_AUTH_PASS || 'secret123';

  // Get the authorization header
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    // No authorization header, return 401 with WWW-Authenticate header
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  // Parse the authorization header
  const encodedCredentials = authHeader.replace('Basic ', '');
  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
  const [providedUsername, providedPassword] = decodedCredentials.split(':');

  // Check if credentials match
  if (providedUsername === username && providedPassword === password) {
    // Credentials are correct, continue to the next middleware/route
    return NextResponse.next();
  } else {
    // Invalid credentials, return 401
    return new NextResponse('Authentication failed', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack-hmr (hot module replacement)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - public folder files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js|woff|woff2|ttf|eot)).*)',
  ],
}; 