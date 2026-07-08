import { NextRequest, NextResponse } from 'next/server';

import {
  AUTH_SESSION_COOKIE,
  deleteSessionByToken,
} from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_SESSION_COOKIE)?.value;

  await deleteSessionByToken(token);

  const response = NextResponse.json({
    success: true,
    message: '已退出登录',
  });

  response.cookies.set(AUTH_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}