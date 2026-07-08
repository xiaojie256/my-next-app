'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthUser = {
  id: number;
  name: string | null;
  email: string;
};

type MeResponse = {
  success: boolean;
  message: string;
  user?: AuthUser;
};

const featureCards = [
  {
    title: '学习计时',
    description: '后续可以在这里接入开始学习、结束学习、备注记录等功能。',
  },
  {
    title: '记录管理',
    description: '后续可以展示学习时段列表，并支持编辑、删除、筛选和查询。',
  },
  {
    title: '数据同步',
    description: '当前登录注册已经接入数据库，后续学习记录也可以继续接入数据库。',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let ignore = false;

    const checkLogin = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        const data = (await response.json()) as MeResponse;

        if (ignore) {
          return;
        }

        if (!response.ok || !data.user) {
          router.replace('/login');
          return;
        }

        setUser(data.user);
        setIsCheckingLogin(false);
      } catch {
        if (!ignore) {
          router.replace('/login');
        }
      }
    };

    void checkLogin();

    return () => {
      ignore = true;
    };
  }, [router]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      router.replace('/login');
      router.refresh();
    }
  };

  if (isCheckingLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-5 text-sm text-slate-300 shadow-2xl shadow-slate-950/40">
          正在检查登录状态...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400 text-lg font-bold text-slate-950">
              A
            </span>
            <div>
              <p className="text-base font-semibold text-white">App Console</p>
              <p className="text-xs text-slate-400">真正主页 /home</p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-sky-300/40 hover:text-white"
            >
              返回索引页
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? '正在退出...' : '退出登录'}
            </button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-300">
              Dashboard
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              欢迎回来，{user?.name || '学习者'}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
              这里是登录成功后进入的真正主页。
              根路径{' '}
              <span className="rounded-md bg-white/10 px-2 py-1 font-mono text-sky-200">
                /
              </span>{' '}
              仍然只是公开索引页，不承担登录后主页的职责。
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-slate-950/30"
                >
                  <h2 className="text-base font-semibold text-white">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-slate-950/40">
            <p className="text-sm font-medium text-slate-400">当前登录用户</p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs text-slate-500">用户 ID</p>
                <p className="mt-1 font-mono text-sm text-white">
                  {user?.id}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs text-slate-500">昵称</p>
                <p className="mt-1 text-sm text-white">
                  {user?.name || '未设置'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs text-slate-500">邮箱</p>
                <p className="mt-1 break-all text-sm text-white">
                  {user?.email}
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-slate-500">
              当前主页已经不再读取 localStorage。页面展示的用户来自后端 Session，
              退出登录会同时清除服务端会话和浏览器 Cookie。
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}