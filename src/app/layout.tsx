import type { Metadata } from "next";
import "./globals.css";
import MobileNav from "@/app/components/mobile-nav";

export const metadata: Metadata = {
  title: "IA.I Finanças | Visão geral",
  description: "Acompanhe seus hábitos financeiros em uma demonstração da IA.I Finanças.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        {children}
        <MobileNav />
      </body>
    </html>
  );
}