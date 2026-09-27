import type { Movement, MovementCategory } from "@/lib/types";

export const MOVEMENT_CATEGORIES_STORAGE_KEY =
  "iai-financas-movement-categories-v1";
export const MOVEMENT_CATEGORY_CHALLENGE_KEY =
  "iai-financas-category-challenge-v1";

export type MovementCategoryAssignments = Record<string, MovementCategory>;

export type MovementTotals = {
  income: number;
  expenses: number;
};

export type CategoryExpense = {
  category: MovementCategory;
  total: number;
  count: number;
};

function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getMovementTotals(
  movements: readonly Movement[],
): MovementTotals {
  const totals = movements.reduce(
    (current, movement) => {
      if (movement.kind === "income") {
        current.income += movement.amount;
      } else {
        current.expenses += movement.amount;
      }

      return current;
    },
    { income: 0, expenses: 0 },
  );

  return {
    income: roundToCents(totals.income),
    expenses: roundToCents(totals.expenses),
  };
}

export function getSmallExpensesTotal(
  movements: readonly Movement[],
  threshold = 30,
): number {
  const total = movements.reduce(
    (sum, movement) =>
      movement.kind === "expense" && movement.amount < threshold
        ? sum + movement.amount
        : sum,
    0,
  );

  return roundToCents(total);
}

export function getExpensesByCategory(
  movements: readonly Movement[],
): CategoryExpense[] {
  const totals = new Map<MovementCategory, { total: number; count: number }>();

  movements.forEach((movement) => {
    if (movement.kind !== "expense") return;

    const current = totals.get(movement.category) ?? { total: 0, count: 0 };
    totals.set(movement.category, {
      total: current.total + movement.amount,
      count: current.count + 1,
    });
  });

  return [...totals.entries()]
    .map(([category, values]) => ({
      category,
      total: roundToCents(values.total),
      count: values.count,
    }))
    .sort((first, second) => second.total - first.total);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}
