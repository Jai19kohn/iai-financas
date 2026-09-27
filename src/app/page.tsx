"use client";

import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Barcode,
  Bell,
  BriefcaseBusiness,
  Bus,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Coffee,
  Coins,
  CreditCard,
  Eye,
  EyeOff,
  Gift,
  House,
  LayoutDashboard,
  QrCode,
  Search,
  Sparkles,
  Target,
  Trophy,
  Utensils,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { demoBalance, demoMovements } from "@/lib/demo-data";
import { formatCurrency, getExpensesByCategory, getMovementTotals } from "@/lib/finance";
import type { Movement, MovementCategory } from "@/lib/types";

type Period = "7 dias" | "30 dias" | "90 dias";
type CategoryFilter = "Todas" | MovementCategory;

type ChartPoint = {
  label: string;
  amount: number;
};

const chartByPeriod: Record<Period, ChartPoint[]> = {
  "7 dias": [
    { label: "Seg", amount: 54 },
    { label: "Ter", amount: 92 },
    { label: "Qua", amount: 37 },
    { label: "Qui", amount: 118 },
    { label: "Sex", amount: 76 },
    { label: "Sáb", amount: 145 },
    { label: "Dom", amount: 64 },
  ],
  "30 dias": [
    { label: "Sem. 1", amount: 280 },
    { label: "Sem. 2", amount: 355 },
    { label: "Sem. 3", amount: 240 },
    { label: "Sem. 4", amount: 280.8 },
  ],
  "90 dias": [
    { label: "Jul", amount: 920 },
    { label: "Ago", amount: 1080 },
    { label: "Set", amount: 1156 },
  ],
};

const movementIcons: Record<MovementCategory, LucideIcon> = {
  Salário: BriefcaseBusiness,
  Freelance: WalletCards,
  Moradia: House,
  Alimentação: Utensils,
  Transporte: Bus,
  Lazer: Coffee,
};

const navigation = [
  { label: "Visão geral", mobileLabel: "Início", href: "#inicio", icon: LayoutDashboard, isCurrent: true },
  { label: "Jornada 90 dias", mobileLabel: "Jornada", href: "/jornada", icon: Target, isCurrent: false },
  { label: "Recompensas", mobileLabel: "Prêmios", href: "#recompensas", icon: Gift, isCurrent: false },
];

const categories: CategoryFilter[] = [
  "Todas",
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Salário",
  "Freelance",
];

const donutColors = ["#f45100", "#e9a33c", "#43836d", "#557c91", "#9e6547", "#a36b9c"];

function MovementRow({ movement }: Readonly<{ movement: Movement }>) {
  const Icon = movementIcons[movement.category];
  const isIncome = movement.kind === "income";

  return (
    <li className="movement-row">
      <span className={`movement-icon ${isIncome ? "movement-icon-income" : ""}`}>
        <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="movement-description">
        <strong>{movement.title}</strong>
        <span>{movement.detail}</span>
      </span>
      <span className="movement-date">{movement.date}</span>
      <strong className={`movement-amount ${isIncome ? "amount-income" : ""}`}>
        {isIncome ? "+" : "−"} {formatCurrency(movement.amount)}
      </strong>
    </li>
  );
}

export default function HomePage() {
  const [period, setPeriod] = useState<Period>("30 dias");
  const [category, setCategory] = useState<CategoryFilter>("Todas");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [insightExpanded, setInsightExpanded] = useState(false);
  const [notice, setNotice] = useState("");

  const totals = useMemo(() => getMovementTotals(demoMovements), []);
  const expenseCategories = useMemo(() => getExpensesByCategory(demoMovements), []);
  const filteredMovements = useMemo(
    () =>
      category === "Todas"
        ? demoMovements
        : demoMovements.filter((movement) => movement.category === category),
    [category],
  );
  const chartPoints = chartByPeriod[period];
  const maxChartAmount = Math.max(...chartPoints.map((point) => point.amount));
  let donutAngle = 0;
  const donutSegments = expenseCategories.map((item, index) => {
    const start = donutAngle;
    donutAngle += totals.expenses ? (item.total / totals.expenses) * 360 : 0;

    return {
      ...item,
      color: donutColors[index % donutColors.length],
      start,
      end: donutAngle,
    };
  });
  const donutStops = donutSegments
    .map((segment) => [segment.color, `${segment.start}deg`, `${segment.end}deg`].join(" "))
    .join(", ");
  const donutGradient = donutSegments.length
    ? `conic-gradient(${donutStops})`
    : "conic-gradient(#e8e6e3 0deg 360deg)";

  function showDemoNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="IA.I Finanças, início">
          <span className="brand-mark">IA</span>
          <span className="brand-copy">
            <strong>IA.I</strong>
            <small>FINANÇAS</small>
          </span>
        </a>

        <div className="sidebar-label">MENU</div>
        <nav className="side-nav">
          {navigation.map(({ label, href, icon: Icon, isCurrent }) => (
            isCurrent ? (
              <button className="nav-link nav-link-active" type="button" key={label} disabled aria-current="page">
                <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
              </button>
            ) : (
              <Link className="nav-link" href={href} key={label}>
                <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            )
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-note">
          <span className="note-icon"><Sparkles size={17} aria-hidden="true" /></span>
          <p>Um passo de cada vez. Seu futuro agradece.</p>
          <span className="note-progress"><span /></span>
          <small>18 de 90 dias</small>
        </div>
        <button
          className="help-link"
          type="button"
          onClick={() => showDemoNotice("Este protótipo usa somente dados de demonstração.")}
        >
          <CircleHelp size={18} aria-hidden="true" />
          <span>Ajuda</span>
        </button>
        <div className="profile-row">
          <span className="avatar">AM</span>
          <span className="profile-copy"><strong>Ana Martins</strong><small>Perfil de demonstração</small></span>
          <ChevronDown size={16} aria-hidden="true" />
        </div>
      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <span className="topbar-location">Minha vida financeira <ChevronRight size={15} aria-hidden="true" /> <strong>Visão geral</strong></span>
          <div className="topbar-actions">
            <span className="demo-badge"><span /> DADOS DE DEMONSTRAÇÃO</span>
            <button
              className="icon-button notification-button"
              type="button"
              aria-label="Ver notificações"
              onClick={() => showDemoNotice("Você está em uma demonstração. Não há notificações reais.")}
            >
              <Bell size={19} aria-hidden="true" />
              <span className="notification-dot" />
            </button>
          </div>
        </header>

        <div className="mobile-app-header">
          <div className="mobile-app-topline">
            <span className="mobile-avatar">AM</span>
            <span className="mobile-profile-title"><strong>Meu IA.I</strong><small>FINANÇAS</small></span>
            <div className="mobile-header-actions">
              <button className="mobile-header-button" type="button" aria-label="Buscar" onClick={() => showDemoNotice("Busca demonstrativa indisponível nesta versão.")}>
                <Search size={20} aria-hidden="true" />
              </button>
              <button className="mobile-header-button mobile-notification" type="button" aria-label="Ver notificações" onClick={() => showDemoNotice("Você está em uma demonstração. Não há notificações reais.")}>
                <Bell size={20} aria-hidden="true" />
                <span />
              </button>
            </div>
          </div>
          <p className="mobile-greeting">Olá, Ana! Que bom te ver por aqui.</p>
        </div>

        <div className="page-content">
          <div className="mobile-sheet-handle" aria-hidden="true" />
          <div className="mobile-section-heading">Meu IA.I</div>
          <section className="quick-actions" aria-label="Atalhos demonstrativos">
            <button type="button" onClick={() => showDemoNotice("Atalho demonstrativo. Nenhuma transferência foi realizada.")}>
              <span className="quick-action-icon"><QrCode size={20} aria-hidden="true" /></span>
              <span>Pix e<br />transferir</span>
            </button>
            <button type="button" onClick={() => showDemoNotice("Atalho demonstrativo. Nenhum pagamento foi realizado.")}>
              <span className="quick-action-icon"><Barcode size={20} aria-hidden="true" /></span>
              <span>Pagar</span>
            </button>
            <button type="button" onClick={() => showDemoNotice("Cartão virtual disponível apenas como atalho demonstrativo.")}>
              <span className="quick-action-icon"><CreditCard size={20} aria-hidden="true" /></span>
              <span>Cartão<br />virtual</span>
            </button>
          </section>
          <Link className="home-wallet-link" href="/recompensas">
            <span><Coins size={18} aria-hidden="true" /></span>
            <span><strong>Moedas e cupons</strong><small>Veja suas conquistas e recompensas</small></span>
            <ChevronRight size={17} aria-hidden="true" />
          </Link>

          <section className="welcome-row" aria-labelledby="page-title">
            <div>
              <p className="eyebrow">SEXTA-FEIRA, 26 DE SETEMBRO</p>
              <h1 id="page-title">Olá, Ana <span className="wave">!</span></h1>
              <p className="welcome-subtitle">Seu dinheiro em foco. Veja como estão as coisas por aí.</p>
            </div>
            <button
              className="period-select"
              type="button"
              onClick={() => showDemoNotice("Visão do período atualizada para este mês.")}
            >
              <span className="period-indicator" /> Este mês <ChevronDown size={16} aria-hidden="true" />
            </button>
          </section>

          <section className="summary-grid" aria-label="Resumo financeiro">
            <article className="balance-panel">
              <div className="balance-topline">
                <span>Saldo disponível</span>
                <button
                  className="visibility-button"
                  type="button"
                  aria-label={balanceVisible ? "Ocultar saldo" : "Mostrar saldo"}
                  onClick={() => setBalanceVisible((visible) => !visible)}
                >
                  {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <div className="balance-amount">{balanceVisible ? formatCurrency(demoBalance) : "R$ ••••••"}</div>
              <div className="balance-footnote"><span className="balance-dot" /> Valor fictício para demonstração</div>
              <div className="balance-decoration" aria-hidden="true"><span /><span /><span /></div>
            </article>

            <article className="metric-card">
              <div className="metric-heading">
                <span className="metric-icon metric-icon-green"><ArrowDownLeft size={18} aria-hidden="true" /></span>
                <span>Entradas</span>
              </div>
              <strong className="metric-value">{formatCurrency(totals.income)}</strong>
              <span className="metric-caption">neste período</span>
            </article>

            <article className="metric-card">
              <div className="metric-heading">
                <span className="metric-icon metric-icon-orange"><ArrowUpRight size={18} aria-hidden="true" /></span>
                <span>Saídas</span>
              </div>
              <strong className="metric-value">{formatCurrency(totals.expenses)}</strong>
              <span className="metric-caption">neste período</span>
            </article>
          </section>

          <section className="spending-donut-panel" aria-labelledby="spending-donut-title">
            <div className="spending-donut-heading">
              <div>
                <p className="eyebrow">VISÃO DO MÊS</p>
                <h2 id="spending-donut-title">Gastos por categoria</h2>
              </div>
              <Link href="/controle-gastos" className="donut-details-link">Detalhes <ChevronRight size={15} aria-hidden="true" /></Link>
            </div>
            <div className="spending-donut-content">
              <div
                className="spending-donut"
                role="img"
                aria-label={`Distribuição demonstrativa de ${formatCurrency(totals.expenses)} em gastos por categoria`}
                style={{ background: donutGradient }}
              >
                <span><strong>{formatCurrency(totals.expenses)}</strong><small>total gasto</small></span>
              </div>
              <ul className="spending-donut-legend">
                {donutSegments.map((segment) => (
                  <li key={segment.category}>
                    <span className="donut-legend-label"><i style={{ backgroundColor: segment.color }} />{segment.category}</span>
                    <strong>{formatCurrency(segment.total)}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <p className="donut-demo-note">Valores fictícios para demonstração</p>
          </section>

          <section className="insight-banner" aria-label="Dica da IA.I">
            <span className="insight-symbol"><Sparkles size={20} aria-hidden="true" /></span>
            <div className="insight-copy">
              <span className="insight-label">UM OLHAR DA IA.I</span>
              <p><strong>Pequenos passos contam.</strong> Você já acompanhou seus gastos esta semana. Que tal escolher uma meta para o próximo mês?</p>
              {insightExpanded && <p className="insight-extra">Uma meta funciona melhor quando tem um valor possível e um motivo importante para você. Comece com o que cabe no seu momento.</p>}
            </div>
            <button className="text-action" type="button" onClick={() => setInsightExpanded((expanded) => !expanded)}>
              {insightExpanded ? "Mostrar menos" : "Entenda"} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </section>

          <Link className="mobile-control-entry" href="/controle-gastos">
            <span className="mobile-control-icon"><ArrowUpRight size={19} aria-hidden="true" /></span>
            <span><strong>Controle de Gastos</strong><small>Descubra seus gastos e evite surpresas no fim do mês.</small></span>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>

          <div className="dashboard-grid">
            <section className="panel spending-panel" aria-labelledby="spending-title">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">SEU RITMO</p>
                  <h2 id="spending-title">Despesas ao longo do tempo</h2>
                </div>
                <div className="segmented-control" aria-label="Período do gráfico">
                  {(["7 dias", "30 dias", "90 dias"] as Period[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={period === option}
                      className={period === option ? "segment-active" : ""}
                      onClick={() => setPeriod(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="chart-summary">
                <strong>{formatCurrency(period === "30 dias" ? totals.expenses : chartPoints.reduce((sum, point) => sum + point.amount, 0))}</strong>
                <span>em despesas <span className="chart-summary-dot" /> {period.toLowerCase()}</span>
              </div>
              <div className={`bar-chart chart-${chartPoints.length}`} role="img" aria-label={`Gráfico demonstrativo de despesas nos últimos ${period}`}>
                <div className="chart-gridlines" aria-hidden="true"><span /><span /><span /><span /></div>
                {chartPoints.map((point, index) => (
                  <div className="bar-column" key={point.label}>
                    <div className="bar-track">
                      <span
                        className={`chart-bar ${index === chartPoints.length - 1 ? "chart-bar-current" : ""}`}
                        style={{ height: `${Math.max(12, (point.amount / maxChartAmount) * 100)}%` }}
                        title={`${point.label}: ${formatCurrency(point.amount)}`}
                      />
                    </div>
                    <span className="bar-label">{point.label}</span>
                  </div>
                ))}
              </div>
              <div className="chart-footnote"><span className="legend-dot" /> Valores simulados para demonstração</div>
            </section>

            <section className="panel category-panel" aria-labelledby="category-title">
              <div className="panel-heading category-heading">
                <div>
                  <p className="eyebrow">PARA ONDE VAI</p>
                  <h2 id="category-title">Seus gastos</h2>
                </div>
                <button className="icon-button small-icon-button" type="button" aria-label="Mais opções de gastos" onClick={() => showDemoNotice("Mais detalhes estarão disponíveis nas próximas etapas do protótipo.")}>
                  <ChevronDown size={17} aria-hidden="true" />
                </button>
              </div>
              <div className="category-total">{formatCurrency(totals.expenses)} <span>no período</span></div>
              <div className="category-list">
                {[
                  { name: "Moradia", amount: 900, color: "category-orange" },
                  { name: "Alimentação", amount: 206.9, color: "category-yellow" },
                  { name: "Transporte", amount: 48.9, color: "category-green" },
                ].map((item) => {
                  const share = totals.expenses ? (item.amount / totals.expenses) * 100 : 0;
                  return (
                    <div className="category-item" key={item.name}>
                      <div className="category-item-top"><span><i className={item.color} />{item.name}</span><strong>{Math.round(share)}%</strong></div>
                      <div className="category-track"><span className={item.color} style={{ width: `${share}%` }} /></div>
                    </div>
                  );
                })}
              </div>
              <a className="panel-link" href="#movimentacoes">Ver movimentações <ChevronRight size={16} aria-hidden="true" /></a>
            </section>

            <section className="panel movements-panel" id="movimentacoes" aria-labelledby="movements-title">
              <div className="panel-heading movements-heading">
                <div>
                  <p className="eyebrow">ACOMPANHE DE PERTO</p>
                  <h2 id="movements-title">Últimas movimentações</h2>
                </div>
                <label className="filter-select-wrap">
                  <span className="sr-only">Filtrar por categoria</span>
                  <select value={category} onChange={(event) => setCategory(event.target.value as CategoryFilter)}>
                    {categories.map((option) => <option key={option} value={option}>{option === "Todas" ? "Todas as categorias" : option}</option>)}
                  </select>
                  <ChevronDown size={15} aria-hidden="true" />
                </label>
              </div>
              <ul className="movement-list">
                {filteredMovements.length > 0 ? filteredMovements.map((movement) => <MovementRow key={movement.id} movement={movement} />) : (
                  <li className="empty-state">Nenhuma movimentação nesta categoria.</li>
                )}
              </ul>
              <button className="all-movements-button" type="button" onClick={() => showDemoNotice("Este extrato contém somente movimentações fictícias.")}>
                Ver todas as movimentações <ChevronRight size={16} aria-hidden="true" />
              </button>
            </section>

            <section className="journey-panel" aria-labelledby="journey-title">
              <div className="journey-topline">
                <span className="journey-icon"><Trophy size={19} aria-hidden="true" /></span>
                <span className="journey-tag">SUA JORNADA</span>
                <span className="journey-week">90 DIAS</span>
              </div>
              <h2 id="journey-title">Seu dinheiro, suas escolhas.</h2>
              <p>12 desafios curtos para transformar conhecimento financeiro em hábitos possíveis.</p>
              <div className="journey-progress-row"><span>Seu ritmo, sem punições</span><strong>13 etapas</strong></div>
              <Link className="journey-action" href="/jornada">Conhecer a jornada <ArrowRight size={17} aria-hidden="true" /></Link>
              <span className="journey-decoration" aria-hidden="true"><span /><span /><span /></span>
            </section>

            <Link className="reward-strip" id="recompensas" href="/recompensas" aria-label="Abrir carteira de moedas e cupons">
              <span className="reward-icon"><Gift size={19} aria-hidden="true" /></span>
              <div><strong>Uma surpresa no final?</strong><span>Recompensas são simuladas neste protótipo.</span></div>
              <span className="reward-check"><Check size={16} aria-hidden="true" /></span>
            </Link>
          </div>
          <footer className="page-footer">IA.I Finanças é um protótipo de demonstração. Não representa um produto oficial nem oferece serviços financeiros reais.</footer>
        </div>
      </main>

      {notice && <output className="toast-message" aria-live="polite">{notice}</output>}
    </div>
  );
}