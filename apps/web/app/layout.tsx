import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kitty — твой ритм, твоя сила",
  description: "Личный план тренировок: расписание недели, упражнения и маленькие победы каждый день.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
