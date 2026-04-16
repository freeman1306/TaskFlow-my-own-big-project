import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== 'test@test.com' || password !== '12345678') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // create cookie-session here
  (await cookies()).set('session', ' valid', {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}
