"use client";

import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { dateKey, mondayOf, monthDates, shortDate } from "./calendar";
import { exerciseKey, week } from "./plan";

export default function MonthCalendar({ done, onSelectDate }: { done: string[]; onSelectDate: (date: Date) => void }) {
  const [today, setToday] = useState(new Date(2026, 10, 8));
  const [offset, setOffset] = useState(0);
  useEffect(() => { setToday(new Date()); }, []);
  const month = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const title = month.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });

  return <section className="month-section" aria-labelledby="month-heading">
    <div className="section-heading"><h2 id="month-heading">твой месяц</h2><div className="month-navigation"><button aria-label="предыдущий месяц" onClick={() => setOffset((value) => value - 1)}><ChevronLeft size={18} /></button><span aria-live="polite">{title}</span><button aria-label="следующий месяц" onClick={() => setOffset((value) => value + 1)}><ChevronRight size={18} /></button></div></div>
    <div className="month-calendar panel">
      <div className="month-weekdays" aria-hidden="true">{week.map((day) => <span key={day.day}>{day.day}</span>)}</div>
      <div className="month-days">{monthDates(month.getFullYear(), month.getMonth()).map((date) => {
        const index = (date.getDay() + 6) % 7;
        const plan = week[index];
        const id = dateKey(date);
        const count = plan.exercises.filter((exercise) => done.includes(exerciseKey(dateKey(mondayOf(date)), index, exercise.id))).length;
        const complete = plan.exercises.length > 0 && count === plan.exercises.length;
        const status = complete ? "выполнено" : count > 0 ? "в процессе" : plan.exercises.length ? "тренировка" : "отдых";
        return <button key={id} className={`month-day ${date.getMonth() !== month.getMonth() ? "outside-month" : ""} ${plan.exercises.length ? "has-training" : ""} ${complete ? "is-complete" : count > 0 ? "in-progress" : ""}`} aria-label={`${shortDate(date)}: ${plan.label}, ${status}`} aria-current={id === dateKey(today) ? "date" : undefined} onClick={() => onSelectDate(date)}><span className="month-date">{date.getDate()}</span><span className="month-day-status" aria-hidden="true">{complete ? <Check size={15} /> : <span className="month-dot" />}</span><span className="month-day-label">{complete ? "готово" : plan.label}</span></button>;
      })}</div>
      <div className="month-legend"><span><i className="legend-training" />тренировка</span><span><i className="legend-partial" />в процессе</span><span><i className="legend-complete" />выполнено</span><span><i className="legend-rest" />отдых</span></div>
      {offset !== 0 && <button className="text-button month-reset" onClick={() => setOffset(0)}>этот месяц</button>}
    </div>
  </section>;
}
