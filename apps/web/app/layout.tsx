import type { Metadata, Viewport } from "next";
import "./globals.css";
import KittyCompanion from "./kitty-companion";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const metadata: Metadata = {
  title: "kitty",
  description: "личный план тренировок: расписание недели, упражнения и маленькие победы каждый день.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}<KittyCompanion /></body></html>;
}
