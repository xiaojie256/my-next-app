'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type AuthMode = 'login' | 'register';

type AuthResponse = {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string | null;
    email: string;
  };
};

function getMode(value: string | null): AuthMode {
  return value === 'register' ? 'register' : 'login';
}

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mode = useMemo<AuthMode>(() => {
    return getMode(searchParams.get('mode'));
  }, [searchParams]);

  const isRegister = mode === 'register';

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    remember: true,
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const switchMode = (nextMode: AuthMode) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextMode === 'login') {
      nextParams.delete('mode');
    } else {
      nextParams.set('mode', 'register');
    }

    const query = nextParams.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (!loginForm.email.trim() || !loginForm.password) {
      alert('邮箱和密码不能为空');
      return;
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginForm.email,
        password: loginForm.password,
      }),
    });

    const data = (await response.json()) as AuthResponse;

    alert(data.message);

    if (response.ok) {
      router.push('/');
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();

    if (
      !registerForm.name.trim() ||
      !registerForm.email.trim() ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      alert('请完整填写注册信息');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }

    if (!registerForm.agree) {
      alert('请先同意服务条款和隐私政策');
      return;
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      }),
    });

    const data = (await response.json()) as AuthResponse;

    alert(data.message);

    if (response.ok) {
      switchMode('login');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_28rem)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />

        <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-slate-950/50 backdrop-blur-xl md:grid-cols-[1fr_1.05fr]">
          <div className="hidden flex-col justify-between border-r border-white/10 bg-white/[0.04] p-10 md:flex">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400 text-lg font-bold text-slate-950">
                  A
                </span>
                <span className="text-lg font-semibold tracking-tight">
                  App Console
                </span>
              </Link>

              <div className="mt-16 space-y-5">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-200/80">
                  Welcome back
                </p>
                <h1 className="max-w-sm text-4xl font-semibold leading-tight tracking-tight text-white">
                  用一个干净、稳定的入口管理你的账户
                </h1>
                <p className="max-w-md text-sm leading-7 text-slate-300">
                  登录与注册共用同一套视觉布局，切换时不刷新页面，表单状态互不干扰，体验更顺滑。
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="font-medium text-white">安全清晰</p>
                <p className="mt-1 leading-6">
                  登录、注册状态由 URL 参数控制，刷新后仍能保持正确页面。
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="font-medium text-white">平滑切换</p>
                <p className="mt-1 leading-6">
                  不依赖复杂动画库，减少切换异常和 hydration 问题。
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 md:hidden">
                <Link href="/" className="inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400 text-lg font-bold text-slate-950">
                    A
                  </span>
                  <span className="text-lg font-semibold tracking-tight">
                    App Console
                  </span>
                </Link>
              </div>

              <div className="mb-8">
                <div className="mb-6 inline-flex rounded-2xl border border-white/10 bg-slate-950/50 p-1">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className={[
                      'rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200',
                      !isRegister
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-300 hover:text-white',
                    ].join(' ')}
                  >
                    登录
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className={[
                      'rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200',
                      isRegister
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-300 hover:text-white',
                    ].join(' ')}
                  >
                    注册
                  </button>
                </div>

                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  {isRegister ? '创建新账户' : '欢迎回来'}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {isRegister
                    ? '填写下面的信息，开始使用你的账户。'
                    : '请输入你的邮箱和密码继续访问。'}
                </p>
              </div>

              <div className="relative overflow-hidden">
                <div
                  className={[
                    'flex w-[200%] transition-transform duration-300 ease-out',
                    isRegister ? '-translate-x-1/2' : 'translate-x-0',
                  ].join(' ')}
                >
                  <div className="w-1/2 pr-2">
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div>
                        <label
                          htmlFor="login-email"
                          className="mb-2 block text-sm font-medium text-slate-200"
                        >
                          邮箱
                        </label>
                        <input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          value={loginForm.email}
                          onChange={(event) =>
                            setLoginForm((current) => ({
                              ...current,
                              email: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-4 focus:ring-sky-300/10"
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <label
                            htmlFor="login-password"
                            className="block text-sm font-medium text-slate-200"
                          >
                            密码
                          </label>
                          <Link
                            href="/forgot-password"
                            className="text-sm text-sky-300 transition hover:text-sky-200"
                          >
                            忘记密码？
                          </Link>
                        </div>
                        <input
                          id="login-password"
                          type="password"
                          autoComplete="current-password"
                          value={loginForm.password}
                          onChange={(event) =>
                            setLoginForm((current) => ({
                              ...current,
                              password: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-4 focus:ring-sky-300/10"
                          placeholder="请输入密码"
                        />
                      </div>

                      <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
                        <input
                          type="checkbox"
                          checked={loginForm.remember}
                          onChange={(event) =>
                            setLoginForm((current) => ({
                              ...current,
                              remember: event.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-white/20 bg-slate-950 text-sky-400 focus:ring-sky-300"
                        />
                        保持登录状态
                      </label>

                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-950/30 transition hover:bg-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/20"
                      >
                        登录
                      </button>

                      <p className="text-center text-sm text-slate-400">
                        还没有账户？{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('register')}
                          className="font-medium text-sky-300 transition hover:text-sky-200"
                        >
                          立即注册
                        </button>
                      </p>
                    </form>
                  </div>

                  <div className="w-1/2 pl-2">
                    <form onSubmit={handleRegister} className="space-y-5">
                      <div>
                        <label
                          htmlFor="register-name"
                          className="mb-2 block text-sm font-medium text-slate-200"
                        >
                          昵称
                        </label>
                        <input
                          id="register-name"
                          type="text"
                          autoComplete="name"
                          value={registerForm.name}
                          onChange={(event) =>
                            setRegisterForm((current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-4 focus:ring-sky-300/10"
                          placeholder="你的昵称"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="register-email"
                          className="mb-2 block text-sm font-medium text-slate-200"
                        >
                          邮箱
                        </label>
                        <input
                          id="register-email"
                          type="email"
                          autoComplete="email"
                          value={registerForm.email}
                          onChange={(event) =>
                            setRegisterForm((current) => ({
                              ...current,
                              email: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-4 focus:ring-sky-300/10"
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="register-password"
                          className="mb-2 block text-sm font-medium text-slate-200"
                        >
                          密码
                        </label>
                        <input
                          id="register-password"
                          type="password"
                          autoComplete="new-password"
                          value={registerForm.password}
                          onChange={(event) =>
                            setRegisterForm((current) => ({
                              ...current,
                              password: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-4 focus:ring-sky-300/10"
                          placeholder="至少 8 位密码"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="register-confirm-password"
                          className="mb-2 block text-sm font-medium text-slate-200"
                        >
                          确认密码
                        </label>
                        <input
                          id="register-confirm-password"
                          type="password"
                          autoComplete="new-password"
                          value={registerForm.confirmPassword}
                          onChange={(event) =>
                            setRegisterForm((current) => ({
                              ...current,
                              confirmPassword: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-4 focus:ring-sky-300/10"
                          placeholder="再次输入密码"
                        />
                      </div>

                      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-300">
                        <input
                          type="checkbox"
                          checked={registerForm.agree}
                          onChange={(event) =>
                            setRegisterForm((current) => ({
                              ...current,
                              agree: event.target.checked,
                            }))
                          }
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950 text-sky-400 focus:ring-sky-300"
                        />
                        <span>
                          我已阅读并同意{' '}
                          <Link
                            href="/terms"
                            className="text-sky-300 transition hover:text-sky-200"
                          >
                            服务条款
                          </Link>{' '}
                          和{' '}
                          <Link
                            href="/privacy"
                            className="text-sky-300 transition hover:text-sky-200"
                          >
                            隐私政策
                          </Link>
                        </span>
                      </label>

                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-950/30 transition hover:bg-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/20"
                      >
                        创建账户
                      </button>

                      <p className="text-center text-sm text-slate-400">
                        已有账户？{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          className="font-medium text-sky-300 transition hover:text-sky-200"
                        >
                          返回登录
                        </button>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}