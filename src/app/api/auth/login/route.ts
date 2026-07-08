import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import {
  AUTH_SESSION_COOKIE,
  createSession,
  getAuthCookieOptions,
} from '@/lib/auth';
import db from '@/lib/db';

type LoginRequestBody = {
  email?: string;
  password?: string;
};

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let body: LoginRequestBody;

  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: '请求格式错误，请发送 JSON 数据',
      },
      {
        status: 400,
      },
    );
  }

  const email =
    typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        message: '邮箱和密码不能为空',
      },
      {
        status: 400,
      },
    );
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: '邮箱或密码错误',
        },
        {
          status: 401,
        },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: '邮箱或密码错误',
        },
        {
          status: 401,
        },
      );
    }

    const session = await createSession(user.id);

    const response = NextResponse.json(
      {
        success: true,
        message: '登录成功',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 200,
      },
    );

    response.headers.set('Cache-Control', 'no-store');

    response.cookies.set({
      name: AUTH_SESSION_COOKIE,
      value: session.rawToken,
      ...getAuthCookieOptions(),
    });

    return response;
  } catch (error) {
    console.error('login error:', error);

    return NextResponse.json(
      {
        success: false,
        message: '服务器错误，登录失败',
      },
      {
        status: 500,
      },
    );
  }
}