import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const data = await loginUser(username, password);

    return NextResponse.json({
      message: 'Login successful',
      user: data.user,
      profile: data.profile,
    });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
