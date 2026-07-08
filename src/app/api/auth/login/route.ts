import { compare } from 'bcryptjs';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

type LoginRequestBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: LoginRequestBody;

  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return Response.json(
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
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return Response.json(
      {
        success: false,
        message: '邮箱和密码不能为空',
      },
      {
        status: 400,
      },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return Response.json(
      {
        success: false,
        message: '邮箱或密码错误',
      },
      {
        status: 401,
      },
    );
  }

  const isPasswordCorrect = await compare(password, user.password);

  if (!isPasswordCorrect) {
    return Response.json(
      {
        success: false,
        message: '邮箱或密码错误',
      },
      {
        status: 401,
      },
    );
  }

  return Response.json({
    success: true,
    message: '登录成功',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}