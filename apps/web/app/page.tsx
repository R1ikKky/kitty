import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, validSession } from "../lib/auth";
import Dashboard from "./dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (!validSession((await cookies()).get(sessionCookie)?.value)) redirect("/login");
  return <Dashboard />;
}
