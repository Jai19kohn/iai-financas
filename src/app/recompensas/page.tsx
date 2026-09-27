import type { Metadata } from "next";
import RewardsClient from "./rewards-client";

export const metadata: Metadata = {
  title: "Moedas e cupons | IA.I Finanças",
  description: "Carteira demonstrativa de moedas, conquistas e cupons da jornada.",
};

export default function RewardsPage() {
  return <RewardsClient />;
}