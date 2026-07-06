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

  const email = typeof body.email === 'string' ? body.email.trim() : '';
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

  // 这里先写假逻辑，后面再换成数据库查询
  if (email === 'test@example.com' && password === '123456') {
    return Response.json({
      success: true,
      message: '登录成功',
      user: {
        id: 1,
        email,
        name: '测试用户',
      },
    });
  }

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