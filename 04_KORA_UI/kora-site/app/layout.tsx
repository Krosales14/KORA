import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KORA | Sitio Web Oficial",
  description:
    "Plataforma inteligente para planificar, presupuestar y abastecer proyectos constructivos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}