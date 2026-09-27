"use client";

import { ArrowRight, BriefcaseBusiness, Bus, Coffee, House, Sparkles, Utensils, WalletCards, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MOVEMENT_CATEGORIES_STORAGE_KEY, MOVEMENT_CATEGORY_CHALLENGE_KEY, type MovementCategoryAssignments } from "@/lib/finance";
import type { Movement, MovementCategory } from "@/lib/types";
import styles from "./statement.module.css";

const movementIcons: Record<MovementCategory, LucideIcon> = {
  Salário: BriefcaseBusiness,
  Freelance: WalletCards,
  Moradia: House,
  Alimentação: Utensils,
  Transporte: Bus,
  Lazer: Coffee,
};
const expenseCategories: MovementCategory[] = ["Alimentação", "Transporte", "Moradia", "Lazer"];

export default function StatementClient({ movements }: Readonly<{ movements: Movement[] }>) {
  const [assignments, setAssignments] = useState<MovementCategoryAssignments>({});
  const [challengeMode, setChallengeMode] = useState(false);
  const [categorizedDuringChallenge, setCategorizedDuringChallenge] = useState(false);

  useEffect(() => {
    setChallengeMode(new URLSearchParams(window.location.search).get("challenge") === "week-4");
    try {
      const stored = localStorage.getItem(MOVEMENT_CATEGORIES_STORAGE_KEY);
      if (stored) setAssignments(JSON.parse(stored) as MovementCategoryAssignments);
    } catch {
      setAssignments({});
    }
  }, []);

  function categorize(movementId: string, category: MovementCategory) {
    const next = { ...assignments, [movementId]: category };
    setAssignments(next);
    localStorage.setItem(MOVEMENT_CATEGORIES_STORAGE_KEY, JSON.stringify(next));
    if (challengeMode) {
      localStorage.setItem(MOVEMENT_CATEGORY_CHALLENGE_KEY, "completed");
      setCategorizedDuringChallenge(true);
    }
  }

  return (
    <>
      <Link className={styles.journeyCallout} href="/jornada">
        <span className={styles.journeyIcon}><Sparkles size={19} aria-hidden="true" /></span>
        <span className={styles.journeyCopy}><small>SUA JORNADA DE 90 DIAS</small><strong>Um passo de cada vez.</strong><span>Continue aprendendo a cuidar do seu dinheiro.</span></span>
        <span className={styles.journeyArrow}><ArrowRight size={18} aria-hidden="true" /></span>
      </Link>

      <section className={styles.activity} aria-labelledby="activity-title">
        <div className={styles.activityHeading}><div><span className={styles.sectionEyebrow}>MOVIMENTAÇÕES RECENTES</span><h2 id="activity-title">Últimas movimentações</h2></div><span className={styles.periodLabel}>Este mês</span></div>
        {challengeMode && <p className={styles.challengeInstruction}>Escolha uma despesa e altere sua categoria para continuar o desafio.</p>}
        <ul className={styles.movementList}>
          {movements.map((movement) => {
            const Icon = movementIcons[movement.category];
            const isIncome = movement.kind === "income";
            const category = assignments[movement.id] ?? movement.category;

            return (
              <li className={styles.movement} key={movement.id}>
                <span className={`${styles.movementIcon} ${isIncome ? styles.incomeIcon : ""}`}><Icon size={18} aria-hidden="true" /></span>
                <span className={styles.movementDetails}><strong>{movement.title}</strong><small>{category} · {movement.date}</small></span>
                {isIncome ? <strong className={`${styles.movementAmount} ${styles.incomeAmount}`}>+ {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(movement.amount)}</strong> : <label className={styles.categoryPicker}><span className={styles.visuallyHidden}>Categoria de {movement.title}</span><select value={category} onChange={(event) => categorize(movement.id, event.target.value as MovementCategory)}>{expenseCategories.map((item) => <option key={item}>{item}</option>)}</select></label>}
              </li>
            );
          })}
        </ul>
        <p className={styles.disclaimer}>Todas as movimentações desta tela são fictícias.</p>
      </section>
      <Link className={`${styles.returnToFinance} ${challengeMode && !categorizedDuringChallenge ? styles.returnDisabled : ""}`} href="/controle-gastos?challenge=week-4-complete" aria-disabled={challengeMode && !categorizedDuringChallenge} onClick={(event) => { if (challengeMode && !categorizedDuringChallenge) event.preventDefault(); }}>Voltar para Finanças <ArrowRight size={15} aria-hidden="true" /></Link>
    </>
  );
}