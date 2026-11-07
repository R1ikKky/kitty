export type Exercise = { id: string; name: string; detail: string; sets: string; reps: string; kind: "squat" | "bridge" | "lunge" | "row" | "press" | "core" };
export type Day = { day: string; label: string; title: string; category: string; minutes: number; exercises: Exercise[] };

const lower: Exercise[] = [
  { id: "squat", name: "Приседания с гантелью", detail: "Двигайся плавно, сохраняй устойчивую опору", sets: "3", reps: "12–15", kind: "squat" },
  { id: "bridge", name: "Ягодичный мостик", detail: "Короткая пауза в верхней точке", sets: "3", reps: "15", kind: "bridge" },
  { id: "lunge", name: "Выпады назад", detail: "Повторения на каждую сторону", sets: "3", reps: "10–12", kind: "lunge" },
  { id: "core", name: "Планка", detail: "Ровное дыхание, комфортное положение", sets: "3", reps: "30 сек", kind: "core" },
];
const upper: Exercise[] = [
  { id: "row", name: "Тяга гантели в наклоне", detail: "Повторения на каждую сторону", sets: "3", reps: "12", kind: "row" },
  { id: "press", name: "Жим гантелей сидя", detail: "Выбирай комфортный вес", sets: "3", reps: "10–12", kind: "press" },
  { id: "pushup", name: "Отжимания от опоры", detail: "Выбирай удобную высоту опоры", sets: "3", reps: "8–12", kind: "core" },
  { id: "deadbug", name: "Мёртвый жук", detail: "Плавно, поочерёдно на каждую сторону", sets: "3", reps: "10", kind: "bridge" },
];

export const week: Day[] = [
  { day: "Пн", label: "Низ тела", title: "Ноги & ягодицы", category: "Силовая тренировка", minutes: 40, exercises: lower },
  { day: "Вт", label: "Отдых", title: "Время выдохнуть", category: "Восстановление", minutes: 0, exercises: [] },
  { day: "Ср", label: "Верх тела", title: "Спина & плечи", category: "Силовая тренировка", minutes: 35, exercises: upper },
  { day: "Чт", label: "Отдых", title: "Забота о себе", category: "Восстановление", minutes: 0, exercises: [] },
  { day: "Пт", label: "Всё тело", title: "Сила всего тела", category: "Силовая тренировка", minutes: 45, exercises: [lower[0], upper[0], lower[1], upper[3]] },
  { day: "Сб", label: "Прогулка", title: "Навстречу свежему воздуху", category: "Активный отдых", minutes: 30, exercises: [] },
  { day: "Вс", label: "Отдых", title: "Медленное воскресенье", category: "Восстановление", minutes: 0, exercises: [] },
];

export const exerciseKey = (weekStart: string, day: number, exercise: string) => `${weekStart}:${day}:${exercise}`;
export const storageKey = "kitty-training-v1";
