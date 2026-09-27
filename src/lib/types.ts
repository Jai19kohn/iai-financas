export type MovementCategory =
  | "Salário"
  | "Freelance"
  | "Moradia"
  | "Alimentação"
  | "Transporte"
  | "Lazer";

export type Movement = {
  id: string;
  title: string;
  detail: string;
  date: string;
  amount: number;
  kind: "income" | "expense";
  category: MovementCategory;
};
