import { Eye, EyeOff } from "lucide-react";
import { demoMovements } from "@/lib/demo-data";
import { formatCurrency, getExpensesByCategory } from "@/lib/finance";
import styles from "./journey-data-preview.module.css";

const categoryExpenses = getExpensesByCategory(demoMovements);
const recentExpenses = demoMovements.filter((movement) => movement.kind === "expense").slice(0, 4);

export default function JourneyDataPreview() {
  return (
    <details className={styles.preview}>
      <summary>
        <span><Eye size={15} aria-hidden="true" /> Visualizar dados</span>
        <EyeOff className={styles.closeIcon} size={15} aria-hidden="true" />
      </summary>
      <div className={styles.content}>
        <p>Resumo demonstrativo para ajudar no desafio. Valores fictícios, sem acesso à sua conta.</p>
        <h4>Gastos por categoria</h4>
        <ul className={styles.categoryList}>
          {categoryExpenses.map(({ category, total }) => (
            <li key={category}><span>{category}</span><strong>{formatCurrency(total)}</strong></li>
          ))}
        </ul>
        <h4>Movimentações recentes</h4>
        <ul className={styles.movementList}>
          {recentExpenses.map((movement) => (
            <li key={movement.id}><span>{movement.title}<small>{movement.category} · {movement.date}</small></span><strong>{formatCurrency(movement.amount)}</strong></li>
          ))}
        </ul>
      </div>
    </details>
  );
}