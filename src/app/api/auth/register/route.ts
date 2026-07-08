import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

type RegisterRequestBody = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: RegisterRequestBody;

  try {
    body = (await request.json()) as RegisterRequestBody;
  } catch {
    return Response.json(
      {
        success: false,
        message: '请求格式错误，请发送正确的 JSON 数据',
      },
      {
        status: 400,
      },
    );
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!name || !email || !password) {
    return Response.json(
      {
        success: false,
        message: '昵称、邮箱和密码不能为空',
      },
      {
        status: 400,
      },
    );
  }

  if (password.length < 8) {
    return Response.json(
      {
        success: false,
        message: '密码至少需要 8 位',
      },
      {
        status: 400,
      },
    );
  }

  const existedUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existedUser) {
    return Response.json(
      {
        success: false,
        message: '该邮箱已经被注册',
      },
      {
        status: 409,
      },
    );
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Response.json(
    {
      success: true,
      message: '注册成功',
      user,
    },
    {
      status: 201,
    },
  );
}