"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Cat, Heart, LockKeyhole } from "lucide-react";

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
      setError(response.status === 429 ? "Слишком много попыток. Попробуй через минуту." : "Пароль не подошёл. Попробуй ещё раз.");
      setPassword("");
    } catch { setError("Не удалось связаться с сайтом. Попробуй ещё раз."); }
    setPending(false);
  }

  return <main className="login-screen"><section className="login-card" aria-labelledby="login-title">
    <span className="brand-mark login-mark"><Cat size={35} strokeWidth={1.5} /></span>
    <span className="section-kicker">ТВОЁ МЕСТО СИЛЫ</span>
    <h1 id="login-title">Привет, Варя <Heart size={24} /></h1>
    <p>Немного времени только для тебя.<br />Введи пароль, чтобы открыть свой план.</p>
    <form onSubmit={submit}>
      <label htmlFor="password">Пароль</label>
      <div className="password-field"><LockKeyhole size={18} /><input id="password" name="password" type="password" inputMode="numeric" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required maxLength={32} autoFocus aria-invalid={Boolean(error)} aria-describedby={error ? "login-error" : undefined} /></div>
      <div className="login-error" id="login-error" role="status" aria-live="polite">{error}</div>
      <button className="primary-button" type="submit" disabled={pending || !password}>{pending ? "Открываем…" : "Войти в своё пространство"}<ArrowRight size={17} /></button>
    </form>
    <span className="login-footnote">С любовью к себе. В своём темпе.</span>
  </section></main>;
}
