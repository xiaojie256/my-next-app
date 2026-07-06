type RegisterRequestBody = {
    name?: string;
    password?: string;
    email?: string;
}

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

  const name = body.name;
  const email = body.email;
  const password = body.password;

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

  if (password.length < 6) {
    return Response.json(
      {
        success: false,
        message: '密码至少需要 6 位',
      },
      {
        status: 400,
      },
    );
  }

  // 这里先写假逻辑，后面再换成数据库创建用户
  return Response.json({
    success: true,
    message: '注册成功',
    user: {
      id: Date.now(),
      name,
      email,
    },
  });
}