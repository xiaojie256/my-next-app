import bcrypt from "bcryptjs";
import db from "@/lib/db";

type RegisterRequestBody = {
  name?: string;
  email?: string;
  password?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: RegisterRequestBody;

  try {
    body = (await request.json()) as RegisterRequestBody;
  } catch {
    return Response.json(
      {
        success: false,
        message: "请求格式错误，请发送正确的 JSON 数据",
      },
      {
        status: 400,
      },
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return Response.json(
      {
        success: false,
        message: "昵称、邮箱和密码不能为空",
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
        message: "密码至少需要 6 位",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const existedUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existedUser) {
      return Response.json(
        {
          success: false,
          message: "该邮箱已经被注册",
        },
        {
          status: 409,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
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
      },
    });

    return Response.json(
      {
        success: true,
        message: "注册成功",
        user,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("register error:", error);

    return Response.json(
      {
        success: false,
        message: "服务器错误，注册失败",
      },
      {
        status: 500,
      },
    );
  }
}