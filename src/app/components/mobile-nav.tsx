"use client";

import {
  ArrowLeftRight,
  CreditCard,
  Grid2X2,
  LayoutDashboard,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavigationItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  page?: "home" | "statement" | "finance" | "rewards";
  featured?: boolean;
  action?: "menu";
};

const navigationItems: NavigationItem[] = [
  { label: "Início", icon: LayoutDashboard, page: "home" },
  { label: "Extrato", icon: ReceiptText, href: "/extrato", page: "statement" },
  { label: "Finanças", icon: ArrowLeftRight, href: "/controle-gastos", page: "finance", featured: true },
  { label: "Produtos", icon: CreditCard, href: "/recompensas", page: "rewards" },
  { label: "Menu", icon: Grid2X2, action: "menu" },
];

const activePages: Record<string, NonNullable<NavigationItem["page"]>> = {
  "/": "home",
  "/extrato": "statement",
  "/controle-gastos": "finance",
  "/recompensas": "rewards",
};

export default function MobileNav() {
  const pathname = usePathname();
  const [notice, setNotice] = useState("");
  const activePage = activePages[pathname];

  function showMenuNotice() {
    setNotice("O menu completo estará disponível em uma próxima etapa do protótipo.");
    window.setTimeout(() => setNotice(""), 3200);
  }

  return (
    <>
      <nav className="mobile-nav" aria-label="Navegação principal">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isCurrent = item.page !== undefined && item.page === activePage;
          const className = `mobile-nav-item ${isCurrent ? "mobile-nav-active" : ""} ${item.featured ? "mobile-nav-featured" : ""}`;

          if (item.action === "menu") {
            return (
              <button className={className} type="button" key={item.label} onClick={showMenuNotice}>
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          }

          if (isCurrent) {
            return (
              <button className={className} type="button" key={item.label} disabled aria-current="page">
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <Link className={className} href={item.href ?? "/"} key={item.label}>
              <Icon size={19} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {notice && <output className="mobile-nav-toast" aria-live="polite">{notice}</output>}
    </>
  );
}