// import * as css from "@/app/css";

import { SubmitButton } from "./SubmitButton";
import { Input } from "./Input";
import { getSession, login, logout } from "@/app/iron-session/ironSessionActions";

export async function Form() {
  const session = await getSession();

  if (session.isLoggedIn) {
    return (
      <>
        <p className="text-lg">
          Logged in user: <strong>{session.username}</strong>
        </p>
        <LogoutButton />
      </>
    );
  }

  return <LoginForm />;
}

function LoginForm() {
  return (
    <form action={login} /*className={css.form}*/>
      <label className="block text-lg">
        <Input />
      </label>
      <div>
        <SubmitButton value="Login" />
      </div>
    </form>
  );
}

function LogoutButton() {
  return (
    <form action={logout} /*className={css.form} */>
      <div>
        <SubmitButton value="Logout" />
      </div>
    </form>
  );
}
