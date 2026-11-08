"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Cat, LockKeyhole } from "lucide-react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) { window.location.replace("/"); return; }
      setError(response.status === 429 ? "слишком много попыток. попробуй через минуту." : "пароль не подошёл. попробуй ещё раз.");
      setPassword("");
    } catch { setError("не удалось связаться с сайтом. попробуй ещё раз."); }
    setPending(false);
  }

  return <main className="login-screen">
    <aside className="login-cover" aria-hidden="true">
      <span className="login-cover-stamp"><Cat size={31} strokeWidth={1.25} /></span>
      <svg className="login-ribbon" viewBox="0 0 500 650" fill="none"><path d="M420-80C115 90 102 260 290 320c215 68 63 287-210 410" stroke="currentColor" strokeWidth="68" /><path d="M420-80C115 90 102 260 290 320c215 68 63 287-210 410" stroke="#f1dfd9" strokeWidth="1" /><path d="M465-55C160 115 147 285 335 345c215 68 63 287-210 410" stroke="#815c60" strokeWidth="1" /></svg>
      <span className="login-cover-wordmark">kitty<span>.</span></span>
    </aside>
    <section className="login-card" aria-labelledby="login-title">
    <a href="/" className="login-brand" aria-label="kitty"><Cat size={22} strokeWidth={1.5} /> kitty.</a>
    <span className="section-kicker">вход</span>
    <h1 id="login-title">приветик,<br /><em>варичка</em></h1>
    <p>введи пароль, чтобы открыть план тренировок.</p>
    <form onSubmit={submit}>
      <label htmlFor="password">пароль</label>
      <div className="password-field"><LockKeyhole size={18} /><input id="password" name="password" type="password" inputMode="numeric" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required maxLength={32} aria-invalid={Boolean(error)} aria-describedby={error ? "login-error" : undefined} /></div>
      <div className="login-error" id="login-error" role="status" aria-live="polite">{error}</div>
      <button className="primary-button" type="submit" disabled={pending || !password}>{pending ? "открываем…" : "войти"}<ArrowRight size={17} /></button>
    </form>
  </section></main>;
}
