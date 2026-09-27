"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  Gift,
  LockKeyhole,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  createJourneyProgress,
  ensureWeekFourDemoProgress,
  getJourneyCoins,
  getLocalDateKey,
  isJourneyRewardReady,
  JOURNEY_STORAGE_KEY,
  normalizeJourneyProgress,
  rewardCoupons,
  WALLET_COUPON_HIGHLIGHT_KEY,
  type JourneyProgress,
} from "@/lib/gamification";
import styles from "./rewards.module.css";

type CouponTab = "available" | "redeemed";

function readProgress(): JourneyProgress {
  try {
    const stored = localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (stored) return ensureWeekFourDemoProgress(normalizeJourneyProgress(JSON.parse(stored)));
  } catch {
    return ensureWeekFourDemoProgress(createJourneyProgress());
  }

  return ensureWeekFourDemoProgress(createJourneyProgress());
}

export default function RewardsClient() {
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [tab, setTab] = useState<CouponTab>("available");
  const [notice, setNotice] = useState("");
  const [highlightedCouponId, setHighlightedCouponId] = useState("");

  useEffect(() => setProgress(readProgress()), []);

  useEffect(() => {
    const highlightedId = sessionStorage.getItem(WALLET_COUPON_HIGHLIGHT_KEY);
    if (!highlightedId) return;
    const coupon = rewardCoupons.find((item) => item.id === highlightedId);
    if (coupon) {
      setHighlightedCouponId(coupon.id);
      setNotice(`${coupon.title} desbloqueado! Resgate quando quiser.`);
    }
    sessionStorage.removeItem(WALLET_COUPON_HIGHLIGHT_KEY);
  }, []);

  useEffect(() => {
    if (!progress) return;
    try {
      localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      setNotice("Não foi possível salvar neste navegador. Os dados continuam apenas nesta sessão.");
    }
  }, [progress]);

  if (!progress) return <main className={styles.loading}>Abrindo sua carteira...</main>;

  const coins = getJourneyCoins(progress);
  const redeemedCoupons = new Set(progress.redeemedCoupons);
  const rewardReady = isJourneyRewardReady(progress);
  const nextCoupon = rewardCoupons.find((coupon) => !redeemedCoupons.has(coupon.id));
  const coinsToNextCoupon = nextCoupon ? Math.max(0, nextCoupon.coinsRequired - coins) : 0;
  const filteredCoupons = rewardCoupons.filter((coupon) =>
    tab === "redeemed"
      ? redeemedCoupons.has(coupon.id)
      : !redeemedCoupons.has(coupon.id),
  );

  function redeemCoupon(couponId: string) {
    const coupon = rewardCoupons.find((item) => item.id === couponId);
    if (!coupon || coins < coupon.coinsRequired) return;
    if (coupon.id === "coupon-120" && !rewardReady) {
      setNotice("O benefício final só fica disponível após 90 dias e a conclusão das 12 semanas.");
      return;
    }

    const date = getLocalDateKey(new Date());
    setProgress((current) => {
      if (!current || current.redeemedCoupons.includes(couponId)) return current;
      return {
        ...current,
        redeemedCoupons: [...current.redeemedCoupons, couponId],
        history: [...current.history, {
          id: `redeem-${couponId}-${date}`,
          title: `${coupon.title} resgatado`,
          detail: "Resgate demonstrativo · moedas não descontadas",
          date,
        }],
      };
    });
    setTab("redeemed");
    setNotice("Resgate simulado. Nenhum benefício real foi concedido.");
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.backButton} href="/controle-gastos" aria-label="Voltar para Finanças"><ArrowLeft size={20} aria-hidden="true" /></Link>
        <div><span className={styles.eyebrow}>IA.I FINANÇAS</span><h1>Suas moedas</h1></div>
        <span className={styles.headerCoin}><Coins size={16} aria-hidden="true" /> {coins}</span>
      </header>

      <div className={styles.content}>
        <section className={styles.walletSummary} aria-label="Saldo de moedas">
          <div className={styles.coinIcon}><Coins size={26} aria-hidden="true" /></div>
          <span className={styles.sectionLabel}>SALDO ACUMULADO</span>
          <strong>{coins}</strong>
          <span className={styles.coinWord}>moedas</span>
          {nextCoupon ? (
            <>
              <p>Faltam {coinsToNextCoupon} moedas para {nextCoupon.title.toLowerCase()}.</p>
              <progress className={styles.coinProgress} aria-label="Progresso para o próximo cupom" value={Math.min(coins, nextCoupon.coinsRequired)} max={nextCoupon.coinsRequired} />
            </>
          ) : <p>Todos os cupons demonstrativos foram resgatados.</p>}
          <small>Moedas são cumulativas e não são descontadas ao resgatar.</small>
        </section>

        <section className={styles.couponsSection} aria-labelledby="coupons-title">
          <div className={styles.sectionHeading}>
            <div><span className={styles.sectionLabel}>RECOMPENSAS</span><h2 id="coupons-title">Seus cupons</h2></div>
            <div className={styles.tabs}>
              <button type="button" aria-pressed={tab === "available"} onClick={() => setTab("available")}>Disponíveis</button>
              <button type="button" aria-pressed={tab === "redeemed"} onClick={() => setTab("redeemed")}>Resgatados</button>
            </div>
          </div>

          {filteredCoupons.length ? (
            <div className={styles.couponList}>
              {filteredCoupons.map((coupon, index) => {
                const isRedeemed = redeemedCoupons.has(coupon.id);
                const needs90Days = coupon.id === "coupon-120";
                const canRedeem = coins >= coupon.coinsRequired && (!needs90Days || rewardReady);
                let couponIcon: ReactNode = <Gift size={19} aria-hidden="true" />;
                if (index === 2) couponIcon = <Trophy size={19} aria-hidden="true" />;
                if (isRedeemed) couponIcon = <Check size={19} aria-hidden="true" />;
                const lockedLabel = needs90Days && coins >= coupon.coinsRequired
                  ? "90 dias"
                  : `${coupon.coinsRequired} moedas`;
                let couponAction: ReactNode;

                if (isRedeemed) {
                  couponAction = <span className={styles.redeemedBadge}><CheckCircle2 size={14} aria-hidden="true" /> Resgatado</span>;
                } else if (canRedeem) {
                  couponAction = <button className={styles.redeemButton} type="button" onClick={() => redeemCoupon(coupon.id)}>Resgatar <ChevronRight size={14} aria-hidden="true" /></button>;
                } else {
                  couponAction = <span className={styles.lockedBadge}><LockKeyhole size={13} aria-hidden="true" /> {lockedLabel}</span>;
                }

                return (
                  <article className={`${styles.couponCard} ${isRedeemed ? styles.couponRedeemed : ""} ${highlightedCouponId === coupon.id ? styles.couponHighlight : ""}`} key={coupon.id}>
                    <span className={`${styles.couponIcon} ${index === 2 ? styles.finalIcon : ""}`}>{couponIcon}</span>
                    <div className={styles.couponDetails}>
                      <span className={styles.couponTag}>{index === 2 ? "CONQUISTA FINAL" : `MARCO · ${coupon.coinsRequired} MOEDAS`}</span>
                      <strong>{coupon.title}</strong>
                      <span>{coupon.description}</span>
                      <small><Clock3 size={12} aria-hidden="true" /> Validade: durante o experimento demonstrativo</small>
                    </div>
                    {couponAction}
                  </article>
                );
              })}
            </div>
          ) : <p className={styles.emptyState}>{tab === "redeemed" ? "Seus cupons resgatados aparecerão aqui." : "Não há cupons disponíveis nesta aba."}</p>}
        </section>

        <section className={styles.historySection} aria-labelledby="rewards-history-title">
          <div className={styles.sectionHeading}><div><span className={styles.sectionLabel}>CONQUISTAS</span><h2 id="rewards-history-title">Histórico</h2></div><span className={styles.historyCount}>{progress.history.length} registros</span></div>
          {progress.history.length ? (
            <ol>{[...progress.history].reverse().slice(0, 8).map((item) => <li key={item.id}><CheckCircle2 size={15} aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.detail}</small></span><time>{item.date}</time></li>)}</ol>
          ) : <p>Conclua um desafio para registrar sua primeira conquista.</p>}
        </section>

        <p className={styles.rules}>Todos os cupons são simulados, sem valor comercial e sem resgate real. O benefício final de até R$ 100 depende de orçamento e aprovação da campanha; validade e elegibilidade reais ainda não estão definidas.</p>
      </div>
      {notice && <output className={styles.notice} aria-live="polite">{notice}</output>}
    </main>
  );
}