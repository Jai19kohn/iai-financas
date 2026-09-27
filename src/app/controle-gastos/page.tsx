import type { Metadata } from "next";
import FinanceDashboard from "./finance-dashboard";

export const metadata: Metadata = {
  title: "Controle de Gastos | IA.I Finanças",
  description: "Resumo demonstrativo de pequenos gastos e despesas por categoria.",
};

export default function ExpensesPage() {
  return <FinanceDashboard />;
}