import bcrypt from "bcryptjs";
import db from "@/lib/db";

type LoginRequestBody = {
  email?: string;
  password?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: LoginRequestBody;

  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return Response.json(
      {
        success: false,
        message: "请求格式错误，请发送 JSON 数据",
      },
      {
        status: 400,
      },
    );
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return Response.json(
      {
        success: false,
        message: "邮箱和密码不能为空",
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
      return Response.json(
        {
          success: false,
          message: "邮箱或密码错误",
        },
        {
          status: 401,
        },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "邮箱或密码错误",
        },
        {
          status: 401,
        },
      );
    }

    return Response.json({
      success: true,
      message: "登录成功",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("login error:", error);

    return Response.json(
      {
        success: false,
        message: "服务器错误，登录失败",
      },
      {
        status: 500,
      },
    );
  }
}