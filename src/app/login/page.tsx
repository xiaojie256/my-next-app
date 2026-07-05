function LoginTitle() {
	return <h1>登录</h1>;
}

function LoginForm() {
	return (
		<form>
			<input placeholder="用户名" />
			<input placeholder="密码" type="password" />
			<button>登录</button>
		</form>
	);
}

export default function Login() {
	return (
		<main>
			<LoginTitle />
			<LoginForm />
		</main>
	);
}