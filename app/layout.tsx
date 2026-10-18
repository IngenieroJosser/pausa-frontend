import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAUSA — Detecta el engaño antes de actuar",
  description: "Prácticas breves para tomar mejores decisiones ante mensajes sospechosos. Entrena en 4 minutos, sin registro.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#062b53",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
