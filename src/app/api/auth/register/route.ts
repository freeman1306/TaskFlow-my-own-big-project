import { users } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const exists = users.find((user) => user.email === email);

  if (exists) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  users.push({ email, password });

  return NextResponse.json({ success: true });
}
