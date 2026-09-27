import type { Metadata } from "next";
import JourneyClient from "./journey-client";

export const metadata: Metadata = {
  title: "Jornada de 90 dias | IA.I Finanças",
  description: "Uma trilha prática de educação financeira em 12 etapas semanais.",
};

export default function JourneyPage() {
  return <JourneyClient />;
}