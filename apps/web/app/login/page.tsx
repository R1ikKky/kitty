import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../lib/auth";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default async function Login() {
  if (validSession((await cookies()).get(sessionCookie)?.value)) redirect("/");
  return <LoginForm />;
}
