import type { Movement } from "@/lib/types";

export const demoMovements: Movement[] = [
  {
    id: "salary",
    title: "Salário",
    detail: "Conta principal",
    date: "Hoje, 08:42",
    amount: 3200,
    kind: "income",
    category: "Salário",
  },
  {
    id: "market",
    title: "Mercado Vila",
    detail: "Alimentação",
    date: "Ontem, 19:16",
    amount: 182.4,
    kind: "expense",
    category: "Alimentação",
  },
  {
    id: "transport",
    title: "Mobilidade urbana",
    detail: "Transporte",
    date: "Ontem, 07:54",
    amount: 48.9,
    kind: "expense",
    category: "Transporte",
  },
  {
    id: "freelance",
    title: "Projeto de design",
    detail: "Freelance",
    date: "24 set, 16:20",
    amount: 320,
    kind: "income",
    category: "Freelance",
  },
  {
    id: "rent",
    title: "Ajuda em casa",
    detail: "Moradia",
    date: "23 set, 09:05",
    amount: 900,
    kind: "expense",
    category: "Moradia",
  },
  {
    id: "coffee",
    title: "Café da esquina",
    detail: "Alimentação",
    date: "22 set, 17:38",
    amount: 24.5,
    kind: "expense",
    category: "Alimentação",
  },
];

export const demoBalance = 2840.56;

export const demoPreviousMovements: Movement[] = [
  {
    id: "previous-market",
    title: "Mercado do Bairro",
    detail: "Alimentação",
    date: "Período anterior",
    amount: 176.2,
    kind: "expense",
    category: "Alimentação",
  },
  {
    id: "previous-transport",
    title: "Transporte urbano",
    detail: "Transporte",
    date: "Período anterior",
    amount: 62.4,
    kind: "expense",
    category: "Transporte",
  },
  {
    id: "previous-home",
    title: "Contribuição em casa",
    detail: "Moradia",
    date: "Período anterior",
    amount: 840,
    kind: "expense",
    category: "Moradia",
  },
  {
    id: "previous-coffee",
    title: "Lanche",
    detail: "Alimentação",
    date: "Período anterior",
    amount: 31.5,
    kind: "expense",
    category: "Alimentação",
  },
];
