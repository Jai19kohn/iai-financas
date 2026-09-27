import {
  createJourneyProgress,
  ensureWeekFourDemoProgress,
  getDaysUntilNextChallenge,
  getJourneyCoins,
  getJourneyDay,
  getUnlockedWeeks,
  hasRecordedChallengeAction,
  isJourneyRewardReady,
  journeyStages,
  normalizeJourneyProgress,
  rewardCoupons,
} from "@/lib/gamification";
import type { JourneyProgress } from "@/lib/gamification";

describe("progressão da jornada", () => {
  it("contém 12 desafios agrupáveis em três etapas de quatro semanas", () => {
    expect(journeyStages).toHaveLength(12);
    expect(journeyStages.every((stage) => stage.choices.length === 3)).toBe(
      true,
    );
  });

  it("mantém o enunciado, as opções e o feedback do desafio da semana 3", () => {
    const challenge = journeyStages[2];

    expect(challenge.challengeTitle).toBe("Para onde foi seu dinheiro?");
    expect(challenge.challenge).toBe(
      "Aprenda a identificar gastos variáveis e descubra uma oportunidade de economia.",
    );
    expect(challenge.question).toBe(
      "Qual dessas despesas costuma ser mais fácil de ajustar no curto prazo?",
    );
    expect(challenge.choices).toEqual([
      "Aluguel com contrato vigente",
      "Assinatura de streaming pouco utilizada",
      "Parcela obrigatória de financiamento",
    ]);
    expect(challenge.correctChoice).toBe(1);
    expect(challenge.feedback).toBe(
      "Uma assinatura pouco utilizada pode ser revista sem comprometer despesas essenciais.",
    );
    expect(challenge.nextStep).toContain("consultar suas assinaturas");
  });

  it("libera uma nova etapa na segunda-feira e mantém semanas anteriores abertas", () => {
    expect(getUnlockedWeeks("2026-01-01", new Date(2026, 0, 4))).toBe(1);
    expect(getUnlockedWeeks("2026-01-01", new Date(2026, 0, 5))).toBe(2);
    expect(getUnlockedWeeks("2026-01-01", new Date(2026, 0, 19))).toBe(4);
    expect(getDaysUntilNextChallenge(new Date(2026, 0, 4))).toBe(1);
  });

  it("libera a 12ª etapa na semana correta e mantém a jornada até o dia 90", () => {
    expect(getUnlockedWeeks("2026-01-01", new Date(2026, 2, 16))).toBe(12);
    expect(getJourneyDay("2026-01-01", new Date(2026, 2, 31))).toBe(90);
  });

  it("limita a trilha a 12 semanas e a jornada a 90 dias", () => {
    expect(getUnlockedWeeks("2026-01-01", new Date(2026, 2, 26))).toBe(12);
    expect(getJourneyDay("2026-01-01", new Date(2026, 3, 1))).toBe(90);
  });

  it("só libera a recompensa simulada após todas as etapas e o dia 90", () => {
    const completeProgress: JourneyProgress = {
      ...createJourneyProgress(new Date(2026, 0, 1)),
      startedOn: "2026-01-01",
      completedWeeks: journeyStages.map((stage) => stage.week),
    };

    expect(isJourneyRewardReady(completeProgress, new Date(2026, 2, 31))).toBe(
      false,
    );
    expect(isJourneyRewardReady(completeProgress, new Date(2026, 3, 1))).toBe(
      true,
    );
  });

  it("migra a antiga semana 13 para a semana 12 sem perder conclusões", () => {
    const migrated = normalizeJourneyProgress({
      startedOn: "2026-01-01",
      completedWeeks: [1, 4, 12, 13, 13],
    });

    expect(migrated.completedWeeks).toEqual([1, 4, 12]);
    expect(migrated.selectedAnswers).toEqual({});
  });

  it("inicia a demonstração com semanas 1–3 concluídas e a semana 4 disponível", () => {
    const today = new Date(2026, 8, 26);
    const seeded = ensureWeekFourDemoProgress(
      createJourneyProgress(today),
      today,
    );

    expect(seeded.completedWeeks).toEqual([1, 2, 3]);
    expect(getUnlockedWeeks(seeded.startedOn, today)).toBe(4);
    expect(getJourneyCoins(seeded)).toBe(30);
  });

  it("calcula moedas cumulativas sem descontá-las ao resgatar cupons", () => {
    const progress = {
      ...createJourneyProgress(new Date(2026, 0, 5)),
      completedWeeks: [1, 2, 3, 4, 5, 6, 7, 8],
      redeemedCoupons: ["coupon-40"],
    };

    expect(getJourneyCoins(progress)).toBe(80);
    expect(rewardCoupons[0].coinsRequired).toBe(40);
    expect(rewardCoupons[2].description).toContain("até R$ 100");
  });

  it("só considera a ação prática registrada com uma resposta descritiva", () => {
    expect(hasRecordedChallengeAction("   ")).toBe(false);
    expect(hasRecordedChallengeAction("fiz")).toBe(false);
    expect(hasRecordedChallengeAction("Revisei uma assinatura")).toBe(true);
  });
});
