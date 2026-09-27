import type { Metadata } from "next";
import { demoBalance, demoMovements } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/finance";
import styles from "./statement.module.css";
import StatementClient from "./statement-client";

export const metadata: Metadata = {
  title: "Extrato | IA.I Finanças",
  description: "Saldo disponível e últimas movimentações demonstrativas.",
};

export default function StatementPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerBrand}>
          <span className={styles.brandMark}>IA</span>
          <span><strong>IA.I</strong><small>FINANÇAS</small></span>
        </div>
        <span className={styles.demoBadge}><i /> DADOS DE DEMONSTRAÇÃO</span>
      </header>

      <div className={styles.content}>
        <section className={styles.balance} aria-labelledby="balance-title">
          <span className={styles.sectionEyebrow}>MINHA CONTA</span>
          <h1 id="balance-title">Saldo disponível</h1>
          <strong className={styles.balanceValue}>{formatCurrency(demoBalance)}</strong>
          <p>Valor fictício para demonstração</p>
        </section>

        <StatementClient movements={demoMovements} />
      </div>
    </main>
  );
}