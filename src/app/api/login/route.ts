import { NextRequest, NextResponse } from 'next/server';

const validUsers = [
  { username: 'admin', password: 'secret123' },
  { username: 'naeem', password: 'karrom' },
  { username: 'sufian', password: 'mwais' },
];

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ success: false, error: 'Username and password are required.' }, { status: 400 });
  }
  const inputUsername = username.trim().toLowerCase();
  const inputPassword = password.trim().toLowerCase();
  const found = validUsers.find(
    u => u.username.toLowerCase() === inputUsername && u.password.toLowerCase() === inputPassword
  );
  if (!found) {
    return NextResponse.json({ success: false, error: 'Invalid username or password.' }, { status: 401 });
  }
  // Set HttpOnly cookies
  const res = NextResponse.json({ success: true });
  res.cookies.set('auth', '1', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.cookies.set('username', found.username, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
} 