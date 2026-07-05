export default function Home() {
	return (
		<main className="min-h-screen bg-slate-950 text-white">
			<section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
				<p className="mb-4 rounded-full border border-white/20 px-4 py-1 text-sm text-slate-300">
					My Next App
				</p>

				<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
					这是小孑的个人测试 Cloudflare + Next.js 网站
				</h1>

				<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
					这里可以放项目介绍、资料下载、个人主页、后台入口、课程内容或其他网页功能。
				</p>

				<div className="mt-10 flex flex-col gap-4 sm:flex-row">
					<a
						href="#features"
						className="rounded-xl bg-white px-6 py-3 font-medium text-slate-950 hover:bg-slate-200"
					>
						查看功能
					</a>

					<a
						href="https://github.com/xiaojie256/my-next-app"
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-xl border border-white/20 px-6 py-3 font-medium text-white hover:bg-white/10"
					>
						查看 GitHub
					</a>
				</div>
			</section>

			<section id="features" className="mx-auto max-w-5xl px-6 py-24">
				<h2 className="text-3xl font-bold">功能区域</h2>

				<div className="mt-8 grid gap-6 sm:grid-cols-3">
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<h3 className="text-xl font-semibold">页面展示</h3>
						<p className="mt-3 text-slate-300">用于展示文字、图片、资料、链接。</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<h3 className="text-xl font-semibold">文件下载</h3>
						<p className="mt-3 text-slate-300">可以放 PPT、PDF、图片等下载入口。</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<h3 className="text-xl font-semibold">后端接口</h3>
						<p className="mt-3 text-slate-300">后续可以接 API、数据库、登录等功能。</p>
					</div>
				</div>
			</section>

			<section className="justify-center">
				<Find />
			</section>
		</main>
	);
}

function Find() {
	return (
		<div className="mx-auto mt-8 max-w-3xl text-center">
			<h1 className="mb-4 text-xl font-bold">我的网站功能</h1>

			<table className="mx-auto border-collapse text-center [&_th]:border [&_th]:border-white/20 [&_th]:px-4 [&_th]:py-2 [&_td]:border [&_td]:border-white/20 [&_td]:px-4 [&_td]:py-2 text-[36px] font-bold [&_td:nth-child(2)]:min-w-[580px]" style={{ fontFamily: '"SimSun", "宋体", serif' }}>
				<tr>
					<td>网站</td>
					<td>备注</td>
				</tr>
				<tr>
					<td><a href="/login" target="_blank" rel="noopener noreferrer">登录页面</a></td>
					<td></td>
				</tr>
			</table>
		</div>
	);
}