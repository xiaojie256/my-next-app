const links = [
  {
    title: "登录页面",
    description: "打开项目登录入口",
    href: "/login",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col justify-center">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium tracking-[0.28em] text-slate-400">
            QUICK LINKS
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            页面索引
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
            用于快速打开项目中的页面。点击按钮后会以新标签页形式跳转。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {link.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {link.description}
                  </p>
                </div>

                <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300 transition group-hover:border-white/30 group-hover:text-white">
                  打开
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}