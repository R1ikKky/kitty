export type Exercise = { id: string; name: string; detail: string; sets: string; reps: string; kind: "squat" | "bridge" | "lunge" | "row" | "press" | "core" };
export type Day = { day: string; label: string; title: string; category: string; minutes: number; exercises: Exercise[] };

const lower: Exercise[] = [
  { id: "squat", name: "приседания с гантелью", detail: "двигайся плавно, сохраняй устойчивую опору", sets: "3", reps: "12–15", kind: "squat" },
  { id: "bridge", name: "ягодичный мостик", detail: "короткая пауза в верхней точке", sets: "3", reps: "15", kind: "bridge" },
  { id: "lunge", name: "выпады назад", detail: "повторения на каждую сторону", sets: "3", reps: "10–12", kind: "lunge" },
  { id: "core", name: "планка", detail: "ровное дыхание, комфортное положение", sets: "3", reps: "30 сек", kind: "core" },
];
const upper: Exercise[] = [
  { id: "row", name: "тяга гантели в наклоне", detail: "повторения на каждую сторону", sets: "3", reps: "12", kind: "row" },
  { id: "press", name: "жим гантелей сидя", detail: "выбирай комфортный вес", sets: "3", reps: "10–12", kind: "press" },
  { id: "pushup", name: "отжимания от опоры", detail: "выбирай удобную высоту опоры", sets: "3", reps: "8–12", kind: "core" },
  { id: "deadbug", name: "мёртвый жук", detail: "плавно, поочерёдно на каждую сторону", sets: "3", reps: "10", kind: "bridge" },
];

export const week: Day[] = [
  { day: "пн", label: "низ тела", title: "ноги & ягодицы", category: "силовая тренировка", minutes: 40, exercises: lower },
  { day: "вт", label: "отдых", title: "время выдохнуть", category: "восстановление", minutes: 0, exercises: [] },
  { day: "ср", label: "верх тела", title: "спина & плечи", category: "силовая тренировка", minutes: 35, exercises: upper },
  { day: "чт", label: "отдых", title: "забота о себе", category: "восстановление", minutes: 0, exercises: [] },
  { day: "пт", label: "всё тело", title: "сила всего тела", category: "силовая тренировка", minutes: 45, exercises: [lower[0], upper[0], lower[1], upper[3]] },
  { day: "сб", label: "прогулка", title: "навстречу свежему воздуху", category: "активный отдых", minutes: 30, exercises: [] },
  { day: "вс", label: "отдых", title: "медленное воскресенье", category: "восстановление", minutes: 0, exercises: [] },
];

export const exerciseKey = (weekStart: string, day: number, exercise: string) => `${weekStart}:${day}:${exercise}`;
export const storageKey = "kitty-training-v1";
