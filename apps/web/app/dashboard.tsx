"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Cat, Check, ChevronLeft, ChevronRight, CircleHelp, Clock3, Dumbbell, Flame, Heart, Leaf, Pause, Play, RotateCcw, Trophy, X } from "lucide-react";
import { exerciseKey, storageKey, week } from "./plan";
import { dateKey, mondayOf, shifted, shortDate, weekOffset } from "./calendar";
import MonthCalendar from "./month-calendar";

type Tab = "plan" | "progress";
type Saved = { done: string[] };
const empty: Saved = { done: [] };

function KittyArt() {
  return <svg viewBox="0 0 330 230" fill="none" aria-hidden="true" className="kitty-art">
    <ellipse cx="169" cy="197" rx="139" ry="17" fill="#cdbce6" />
    <path d="M62 182h218l-24 27H36z" fill="#ad97ce" /><path d="m53 195 214 1" stroke="#c9b7e2" strokeWidth="2" />
    <path d="M218 161c47 12 64-7 46-29-15-17-36-7-22 7" stroke="#f7f1e8" strokeWidth="18" strokeLinecap="round" />
    <path d="M119 137c21-45 99-37 108 9l-8 37h-96z" fill="#f7f1e8" />
    <path d="M163 143c22-21 43-10 49 15l-9 26h-60z" fill="#b69bdb" />
    <path d="m146 155-33 29H83m111-23 22 23h29" stroke="#f7f1e8" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m102 112-5-46 29 23 26-1 23-24-1 50c4 38-67 44-72-2" fill="#f7f1e8" />
    <path d="m104 79 4 22 11-10m42-11-14 12 16 9" fill="#e8bac9" />
    <path d="m116 115 8 3m24-3-8 3m-9 10 3 2 3-2" stroke="#665078" strokeWidth="3" strokeLinecap="round" />
    <path d="m111 127-23-5m23 13-21 5m68-13 23-5m-23 13 21 5" stroke="#ab94b8" strokeWidth="2" strokeLinecap="round" />
    <path d="M62 152v23m-9-19v16m19-16v16m-19-8h19" stroke="#7c6597" strokeWidth="8" strokeLinecap="round" />
    <path d="m242 65 4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="#fff8e9" /><path d="m70 86 3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#b19acb" />
    <path d="M278 179c-2-26 0-50 13-65m-12 39c-21-1-20-21-20-21 18 0 20 21 20 21m3-19c-3-21 13-28 13-28 7 20-13 28-13 28" stroke="#9d9d7b" strokeWidth="3" fill="#aeb191" strokeLinejoin="round" />
    <path d="M266 174h27l-5 23h-16z" fill="#dfcfbc" />
  </svg>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("plan");
  const [selected, setSelected] = useState(0);
  const [offset, setOffset] = useState(0);
  const [monday, setMonday] = useState(new Date(2026, 10, 2));
  const [saved, setSaved] = useState<Saved>(empty);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  const exerciseList = useRef<HTMLElement>(null);
  const [help, setHelp] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setMonday(mondayOf(new Date()));
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (raw && typeof raw === "object" && "done" in raw && Array.isArray(raw.done)) {
        setSaved({ done: raw.done.filter((item): item is string => typeof item === "string") });
      }
    } catch { setStorageError(true); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); }
    catch { setStorageError(true); }
  }, [saved, ready]);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setSeconds(left);
      if (!left) setRunning(false);
    }, 200);
    return () => window.clearInterval(interval);
  }, [running]);

  const startOfWeek = shifted(monday, offset * 7);
  const weekId = dateKey(startOfWeek);
  const day = week[selected];
  const complete = (dayIndex: number) => week[dayIndex].exercises.filter((exercise) => saved.done.includes(exerciseKey(weekId, dayIndex, exercise.id))).length;
  const completedDays = week.filter((item, index) => item.exercises.length > 0 && complete(index) === item.exercises.length).length;
  const totalDone = week.reduce((sum, _, index) => sum + complete(index), 0);
  const totalExercises = week.reduce((sum, item) => sum + item.exercises.length, 0);
  const todayDone = complete(selected);
  const percent = Math.round(totalDone / totalExercises * 100);
  const toggleExercise = (id: string) => {
    const key = exerciseKey(weekId, selected, id);
    setSaved((previous) => ({ ...previous, done: previous.done.includes(key) ? previous.done.filter((item) => item !== key) : [...previous.done, key] }));
  };
  const toggleTimer = () => {
    if (running) { setSeconds(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))); setRunning(false); }
    else { const duration = seconds || 60; setSeconds(duration); deadline.current = Date.now() + duration * 1000; setRunning(true); }
  };
  const selectDay = (index: number) => { setSelected(index); setStarted(false); };
  const changeWeek = (direction: number) => { setOffset((value) => value + direction); setStarted(false); };

  const nav = [
    { id: "plan" as const, label: "мой план", icon: CalendarDays },
    { id: "progress" as const, label: "мой прогресс", icon: Trophy },
  ];

  return <div className="app-shell">
    <a href="#main" className="skip-link">к содержимому</a>
    <aside className="sidebar">
      <a className="brand" href="/" aria-label="kitty — главная"><span className="brand-mark"><Cat size={27} strokeWidth={1.7} /></span>kitty<span className="brand-dot">.</span></a>
      <nav className="nav-list" aria-label="главная навигация">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`nav-item ${tab === id ? "active" : ""}`} aria-current={tab === id ? "page" : undefined}><Icon size={19} /> <span>{label}</span>{tab === id && <span className="nav-dot" />}</button>)}</nav>
      <button className="help-button" onClick={() => setHelp(true)}><CircleHelp size={18} /> как здесь всё устроено <ArrowUpRight size={15} /></button>
    </aside>

    <main id="main" className="main-content">
      <div className="page-content">
        <div className="page-heading"><h1>приветик, варичка, вот тебе сайтик</h1></div>
        {storageError && <p className="storage-error" role="alert">не удалось сохранить прогресс. проверь настройки браузера.</p>}

          <section className="week-section" aria-label="расписание недели"><div className="section-heading"><h2>твоя неделя <span>3 тренировки · 4 дня для себя</span></h2><div className="week-navigation"><button aria-label="предыдущая неделя" onClick={() => changeWeek(-1)}><ChevronLeft size={17} /></button><span>{shortDate(startOfWeek)} — {shortDate(shifted(startOfWeek, 6))}</span><button aria-label="следующая неделя" onClick={() => changeWeek(1)}><ChevronRight size={17} /></button>{offset !== 0 && <button className="current-week" onClick={() => { setOffset(0); setStarted(false); }}>эта неделя</button>}</div></div><div className="week-grid">{week.map((item, index) => {
            const isComplete = item.exercises.length > 0 && complete(index) === item.exercises.length;
            return <button key={item.day} aria-label={`${item.day}, ${shortDate(shifted(startOfWeek, index))}: ${item.label}${isComplete ? ", выполнено" : ""}`} onClick={() => { selectDay(index); setTab("plan"); }} className={`day-card ${selected === index ? "selected" : ""} ${item.exercises.length ? "training-day" : "rest-day"}`} aria-pressed={selected === index}><span className="day-top">{item.day}<span>{shifted(startOfWeek, index).getDate()}</span></span><span className="day-icon">{isComplete ? <Check size={20} /> : item.exercises.length ? <Dumbbell size={21} /> : <Leaf size={21} />}</span><strong>{item.label}</strong><span className="day-status">{isComplete ? "готово, умница!" : item.exercises.length ? `${item.minutes} минут` : index === 5 ? "свежий воздух" : "восстановление"}</span></button>;
          })}</div></section>

          {tab === "progress" ? <MonthCalendar done={saved.done} onSelectDate={(date) => { setOffset(weekOffset(monday, date)); selectDay((date.getDay() + 6) % 7); setTab("plan"); }} /> : <div className="content-grid"><div className="workout-column">
            <section className="hero-card"><div className="hero-copy"><span className="hero-label"><span />{day.category}</span><h2>{day.title}</h2><div className="hero-meta"><span><Clock3 size={15} />{day.minutes ? `${day.minutes} минут` : "без спешки"}</span><span>{day.exercises.length ? <Dumbbell size={15} /> : <Leaf size={15} />}{day.exercises.length ? `${day.exercises.length} упражнения` : "время для себя"}</span></div>{day.exercises.length > 0 && <button className="primary-button" disabled={!ready} onClick={() => { setStarted(true); exerciseList.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{todayDone === day.exercises.length ? "посмотреть результат" : started ? "продолжить тренировку" : "начать тренировку"}<ArrowRight size={17} /></button>}</div><KittyArt /></section>

            <section ref={exerciseList} className="exercise-section" aria-label="упражнения"><div className="section-heading"><h2>{day.exercises.length ? "твоя тренировка" : "план на сегодня"}</h2>{day.exercises.length > 0 && <span className="exercise-count">{todayDone} из {day.exercises.length} выполнено</span>}</div>{day.exercises.length ? <><div className="warmup-note"><Flame size={18} /><span>сначала — немного разминки</span><span className="warmup-time">5–7 мин</span></div><div className="exercise-table-header"><span>упражнение</span><span>подходы</span><span>повторы</span><span className="sr-only">выполнено</span></div><div className="exercise-list">{day.exercises.map((exercise, index) => {
              const checked = saved.done.includes(exerciseKey(weekId, selected, exercise.id));
              return <article className={`exercise-row ${checked ? "completed" : ""}`} key={exercise.id}><div className={`exercise-thumbnail thumb-${index}`}><Dumbbell size={24} strokeWidth={1.5} /><span>{String(index + 1).padStart(2, "0")}</span></div><div className="exercise-description"><h3>{exercise.name}</h3><p>{exercise.detail}</p></div><div className="exercise-metrics"><span className="exercise-value"><span className="mobile-label">подходы</span>{exercise.sets}</span><span className="exercise-value"><span className="mobile-label">повторы</span>{exercise.reps}</span></div><button className="exercise-check" disabled={!ready} aria-label={`${checked ? "снять отметку" : "отметить выполненным"}: ${exercise.name}`} aria-pressed={checked} onClick={() => toggleExercise(exercise.id)}>{checked && <Check size={18} />}</button></article>;
            })}</div>{todayDone === day.exercises.length && <div className="finish-note all-done" role="status"><Trophy size={18} /> всё получилось! эта маленькая победа — твоя ♡</div>}</> : <div className="rest-panel panel"><Leaf size={32} /><h3>{selected === 5 ? "выйди на небольшую прогулку" : "сегодня можно замедлиться"}</h3><p>{selected === 5 ? "выбери приятный маршрут и комфортный темп. наушники и любимый плейлист — по желанию." : "выспаться, прогуляться или просто отдохнуть. никаких галочек — ты заслуживаешь заботы каждый день."}</p><button className="text-button" onClick={() => { if (selected >= 4) changeWeek(1); selectDay(selected < 4 ? (selected < 2 ? 2 : 4) : 0); }}>посмотреть следующую тренировку <ArrowRight size={16} /></button></div>}</section>
          </div><aside className="right-column"><section className="panel weekly-progress"><div className="section-heading"><h2>маленькие победы</h2><Trophy size={19} /></div><div className="progress-ring" style={{ background: `conic-gradient(var(--purple) ${percent}%, #f0edf4 0)` }}><div><strong>{completedDays}<span>/ 3</span></strong><small>тренировки</small></div></div>{totalDone > 0 && <p>ты уже ближе к своей цели</p>}<div className="progress-footer"><span>прогресс недели</span><strong>{percent}%</strong></div><div className="progress-track"><span style={{ width: `${percent}%` }} /></div><button className="text-button" onClick={() => setTab("progress")}>смотреть прогресс <ArrowUpRight size={16} /></button></section>
          <section className="panel timer-panel"><div className="section-heading"><h2><Clock3 size={18} /> время выдохнуть</h2><span className="tiny-label">отдых</span></div><div className="timer-display" role="timer" aria-label={`осталось ${seconds} секунд`}>{String(Math.floor(seconds / 60)).padStart(2, "0")}<span>:</span>{String(seconds % 60).padStart(2, "0")}</div><div className="timer-presets">{[30, 60, 90].map((value) => <button key={value} aria-pressed={!running && seconds === value} className={!running && seconds === value ? "chosen" : ""} onClick={() => { setRunning(false); setSeconds(value); }}>{value} сек</button>)}</div><div className="timer-controls"><button className="timer-start" onClick={toggleTimer}>{running ? <Pause size={15} /> : <Play size={15} />}{running ? "пауза" : seconds === 0 ? "ещё раз" : "начать отдых"}</button><button className="timer-reset" aria-label="сбросить таймер" onClick={() => { setRunning(false); setSeconds(60); }}><RotateCcw size={17} /></button></div><p role="status" aria-live="polite">{seconds === 0 ? "время вышло. продолжай, когда будешь готова." : "между подходами можно не спешить."}</p></section>
          </aside></div>}
      </div>
    </main>
    <nav className="mobile-nav" aria-label="мобильная навигация">{nav.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined}><Icon size={21} /><span>{label}</span></button>)}</nav>
    {help && <div className="modal-backdrop" onClick={() => setHelp(false)}><HelpDialog onClose={() => setHelp(false)} /></div>}
  </div>;
}

function HelpDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = dialogRef.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={dialogRef} className="help-dialog" aria-labelledby="help-title" onCancel={onClose} onClick={(event) => event.stopPropagation()}><button className="close-dialog" onClick={onClose} aria-label="закрыть"><X size={20} /></button><span className="brand-mark"><Cat size={28} /></span><h2 id="help-title">твоё место силы</h2><p>выбери день недели, открой тренировку и отмечай выполненные упражнения кружком справа.</p><p>таймер поможет засечь отдых между подходами. раздел «мой прогресс» покажет результат выбранной недели.</p><p className="muted">пока здесь пример плана. отметки хранятся только в этом браузере, без синхронизации между устройствами.</p><button className="primary-button" onClick={onClose}>всё понятно <Heart size={16} /></button></dialog>;
}
