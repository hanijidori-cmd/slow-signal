import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "슬로우-시그널 | Slow-Signal",
  description: "남도 관광 트래픽 재분배 서비스 — 2026 관광데이터 활용 공모전",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
