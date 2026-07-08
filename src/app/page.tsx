import Link from 'next/link';

const links = [
  {
    title: '登录页面',
    description: '已有账户时，从这里登录并进入真正主页。',
    href: '/login',
    tag: '登录',
  },
  {
    title: '注册页面',
    description: '创建新账户。注册成功后会自动回到登录页并填入邮箱、密码。',
    href: '/login?mode=register',
    tag: '注册',
  },
  {
    title: '应用主页',
    description: '登录成功后进入的真正主页。当前阶段使用浏览器本地登录状态判断。',
    href: '/home',
    tag: '主页',
  },
];

export default function IndexPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col justify-center">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-300">
            Public Index
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            页面索引
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            当前页面是公开入口，只负责整理项目中的可访问页面。
            它不是登录后的真正主页，真正主页放在
            <span className="mx-1 rounded-md bg-white/10 px-2 py-1 font-mono text-sky-200">
              /home
            </span>
            。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-white/[0.07]"
            >
              <span className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs font-medium text-sky-200">
                {link.tag}
              </span>

              <h2 className="mt-5 text-xl font-semibold text-white">
                {link.title}
              </h2>

              <p className="mt-3 min-h-16 text-sm leading-6 text-slate-300">
                {link.description}
              </p>

              <span className="mt-6 inline-flex text-sm font-medium text-sky-300 transition group-hover:text-sky-200">
                打开 {link.href}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-slate-300">
          <p className="font-medium text-white">当前阶段说明</p>
          <p className="mt-2">
            注册和登录已经通过后端 API 连接数据库。因为项目还没有接入正式
            Cookie / Session / JWT 认证，所以登录成功后的用户信息暂时保存在浏览器
            localStorage 中，用于进入当前阶段的主页。
          </p>
        </div>
      </div>
    </main>
  );
}