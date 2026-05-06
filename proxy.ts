import { NextRequest, NextResponse } from 'next/server';

function unauthorizedResponse() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Resume Admin"',
    },
  });
}

export function proxy(request: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  if (!adminUser || !adminPass) {
    return new NextResponse('ADMIN_USER and ADMIN_PASS are not configured', { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) {
    return unauthorizedResponse();
  }

  const encoded = authHeader.split(' ')[1] ?? '';
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  const [user, pass] = decoded.split(':');

  if (user !== adminUser || pass !== adminPass) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/resume/:path*'],
};

