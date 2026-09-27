import {
  getExpensesByCategory,
  getMovementTotals,
  getSmallExpensesTotal,
} from "@/lib/finance";
import type { Movement } from "@/lib/types";

const movements: Movement[] = [
  {
    id: "income",
    title: "Salário",
    detail: "Conta principal",
    date: "Hoje",
    amount: 3200,
    kind: "income",
    category: "Salário",
  },
  {
    id: "expense-a",
    title: "Mercado",
    detail: "Alimentação",
    date: "Ontem",
    amount: 182.4,
    kind: "expense",
    category: "Alimentação",
  },
  {
    id: "expense-b",
    title: "Ônibus",
    detail: "Transporte",
    date: "Ontem",
    amount: 48.9,
    kind: "expense",
    category: "Transporte",
  },
];

describe("getMovementTotals", () => {
  it("soma entradas e saídas separadamente e arredonda centavos", () => {
    expect(getMovementTotals(movements)).toEqual({
      income: 3200,
      expenses: 231.3,
    });
  });

  it("retorna totais zerados quando não há movimentações", () => {
    expect(getMovementTotals([])).toEqual({ income: 0, expenses: 0 });
  });
});

describe("resumo de gastos", () => {
  it("soma gastos estritamente abaixo do limite e ignora entradas", () => {
    const smallMovement: Movement = {
      id: "coffee",
      title: "Café",
      detail: "Alimentação",
      date: "Hoje",
      amount: 24.5,
      kind: "expense",
      category: "Alimentação",
    };

    expect(getSmallExpensesTotal([...movements, smallMovement])).toBe(24.5);
    expect(getSmallExpensesTotal(movements)).toBe(0);
  });

  it("agrupa despesas por categoria e ordena do maior para o menor", () => {
    const secondFoodMovement: Movement = {
      id: "snack",
      title: "Lanche",
      detail: "Alimentação",
      date: "Hoje",
      amount: 24.5,
      kind: "expense",
      category: "Alimentação",
    };

    expect(getExpensesByCategory([...movements, secondFoodMovement])).toEqual([
      { category: "Alimentação", total: 206.9, count: 2 },
      { category: "Transporte", total: 48.9, count: 1 },
    ]);
    expect(getExpensesByCategory([])).toEqual([]);
  });
});
