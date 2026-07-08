import { NextRequest, NextResponse } from 'next/server';

import {
  AUTH_SESSION_COOKIE,
  getUserBySessionToken,
} from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  const user = await getUserBySessionToken(token);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: '未登录或登录状态已过期',
      },
      {
        status: 401,
      },
    );
  }

  return NextResponse.json({
    success: true,
    message: '已登录',
    user,
  });
}