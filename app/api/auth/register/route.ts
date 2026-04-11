import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

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

    const data = await registerUser(username, password);

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: data.user.id,
        username: data.user.username,
        createdAt: data.user.createdAt,
        backupSecret: data.user.backupSecret,
      },
    });
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
