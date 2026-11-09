"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";

type Action = "idle" | "running" | "jumping";

export default function KittyCompanion() {
  const pathname = usePathname();
  const [position, setPosition] = useState(0.2);
  const [direction, setDirection] = useState(1);
  const [action, setAction] = useState<Action>("idle");
  const [reaction, setReaction] = useState(0);
  const [meow, setMeow] = useState(false);
  const positionRef = useRef(0.2);
  const reactionUntil = useRef(0);
  const reducedMotion = useRef(true);
  const actionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAction = useCallback(() => {
    if (actionTimer.current) clearTimeout(actionTimer.current);
  }, []);

  const roam = useCallback(() => {
    if (reducedMotion.current || document.hidden || Date.now() < reactionUntil.current) return;
    clearAction();
    const current = positionRef.current;
    const next = current < 0.5 ? 0.65 + Math.random() * 0.3 : 0.05 + Math.random() * 0.3;
    setDirection(next > current ? 1 : -1);
    positionRef.current = next;
    setPosition(next);
    setMeow(false);
    setAction("running");
    actionTimer.current = setTimeout(() => {
      setAction("jumping");
      setReaction((count) => count + 1);
      actionTimer.current = setTimeout(() => setAction("idle"), 700);
    }, 2200);
  }, [clearAction]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotion.current = preference.matches;
      clearAction();
      setAction("idle");
      setMeow(false);
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    const interval = setInterval(roam, 8000);
    const onVisibilityChange = () => { if (document.hidden) { clearAction(); setAction("idle"); setMeow(false); } };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearInterval(interval);
      clearAction();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [clearAction, roam]);

  function petKitty() {
    clearAction();
    reactionUntil.current = Date.now() + 1100;
    setReaction((count) => count + 1);
    setAction(reducedMotion.current ? "idle" : "jumping");
    setMeow(true);
    actionTimer.current = setTimeout(() => { setAction("idle"); setMeow(false); }, 1100);
  }

  return <div className="kitty-companion" data-login={pathname === "/login" || undefined} data-action={action} data-petted={meow || undefined} style={{ "--kitty-position": position } as CSSProperties}>
    <span className="kitty-meow" role="status" aria-live="polite">{meow ? "мяу" : ""}</span>
    <button type="button" className="kitty-pet" aria-label="погладить котика" title="погладить котика" onClick={petKitty}>
      <span className="kitty-shadow" aria-hidden="true" />
      <span className="kitty-jump" key={reaction} aria-hidden="true"><svg viewBox="0 0 100 84" className="kitty-sprite" style={{ transform: `scaleX(${direction})` }} fill="none">
        <g stroke="#81545e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path className="kitty-tail" d="M34 53C9 57 5 36 18 29c10-5 17 3 11 9" stroke="#b97589" strokeWidth="8" />
          <path className="kitty-back-leg" d="m39 61-5 13h12l5-13" fill="#c98a9c" />
          <ellipse cx="51" cy="52" rx="24" ry="18" fill="#dba3b2" />
          <path className="kitty-front-leg" d="m62 59-4 15h12l5-19" fill="#e4b5c1" />
          <path d="m56 32-1-19 14 9 13-2 10-10-1 23c7 22-32 29-35-1Z" fill="#e4b5c1" />
          <path d="m60 19 1 9 5-3m21-7-6 6 6 1" fill="#c8879b" stroke="none" />
          {meow ? <path d="m66 33 3-2 3 2m10-1 3-2 3 2" /> : <g className="kitty-eyes"><path d="M69 32v2m15-3v2" /></g>}
          <path d="m75 37 2 1 2-2m-2 2v3l-3 1m3-1 3 1" strokeWidth="1.4" />
          <path d="m64 39-9-2m10 6-9 2m30-8 9-3m-8 7 8 1" strokeWidth="1.1" />
        </g>
      </svg></span>
    </button>
  </div>;
}
