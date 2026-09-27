export type JourneyStage = {
  week: number;
  title: string;
  lesson: string;
  example: string;
  challengeTitle: string;
  challenge: string;
  actionPrompt?: string;
  feedback: string;
  nextStep?: string;
  question: string;
  choices: string[];
  correctChoice: number;
};

export type JourneyProgress = {
  startedOn: string;
  completedWeeks: number[];
  selectedAnswers: Record<string, number>;
  actionNotes: Record<string, string>;
  history: JourneyHistoryEntry[];
  redeemedCoupons: string[];
  personalGoals: PersonalGoal[];
};

export type JourneyHistoryEntry = {
  id: string;
  title: string;
  detail: string;
  date: string;
};

export type PersonalGoal = {
  id: string;
  title: string;
  createdOn: string;
  completedOn?: string;
};

export const JOURNEY_LENGTH_DAYS = 90;
export const JOURNEY_LENGTH_WEEKS = 12;
export const COINS_PER_CHALLENGE = 10;
export const MIN_ACTION_NOTE_LENGTH = 5;
export const JOURNEY_STORAGE_KEY = "iai-financas-journey-v1";
export const WALLET_COUPON_HIGHLIGHT_KEY = "iai-financas-wallet-highlight-v1";

export const journeyPhases = [
  { title: "Entender", startWeek: 1, endWeek: 4 },
  { title: "Planejar", startWeek: 5, endWeek: 8 },
  { title: "Conquistar", startWeek: 9, endWeek: 12 },
] as const;

export const rewardCoupons = [
  {
    id: "coupon-40",
    title: "Primeiro cupom",
    coinsRequired: 40,
    description: "Benefício demonstrativo de R$ 20",
  },
  {
    id: "coupon-80",
    title: "Segundo cupom",
    coinsRequired: 80,
    description: "Benefício demonstrativo de R$ 50",
  },
  {
    id: "coupon-120",
    title: "Prêmio final",
    coinsRequired: 120,
    description:
      "Simulação de benefício de até R$ 100, sujeita à aprovação da campanha",
  },
] as const;

export const journeyStages: JourneyStage[] = [
  {
    week: 1,
    title: "Conheça seu dinheiro",
    lesson:
      "Entradas são valores que chegam; saídas são valores usados ou pagos. Enxergar os dois lados ajuda a entender o mês.",
    example:
      "Salário e renda de um trabalho são entradas. Mercado, transporte e contas são saídas.",
    challengeTitle: "Identifique uma entrada",
    challenge:
      "Reconheça uma fonte de dinheiro que costuma entrar na sua rotina.",
    feedback: "Boa! Você já começou a mapear o caminho do seu dinheiro.",
    question: "Qual exemplo representa uma entrada de dinheiro?",
    choices: ["Salário recebido", "Conta de internet", "Compra no mercado"],
    correctChoice: 0,
  },
  {
    week: 2,
    title: "Descubra seus maiores gastos",
    lesson:
      "Agrupar despesas por categoria ajuda a revelar padrões que ficam escondidos em compras isoladas.",
    example:
      "Um lanche parece pequeno sozinho; várias refeições fora podem formar um gasto importante no mês.",
    challengeTitle: "Encontre uma categoria",
    challenge: "Observe qual grupo de gastos ocupa mais espaço no seu mês.",
    feedback: "Mandou bem. Agora você sabe onde vale olhar com mais atenção.",
    question: "O que ajuda a descobrir os maiores gastos?",
    choices: [
      "Olhar uma compra isolada",
      "Agrupar despesas por categoria",
      "Ignorar gastos recorrentes",
    ],
    correctChoice: 1,
  },
  {
    week: 3,
    title: "Gastos fixos e variáveis",
    lesson:
      "Gastos fixos tendem a se repetir; variáveis mudam conforme suas escolhas e rotina. Separar os dois ajuda a encontrar ajustes possíveis.",
    example:
      "Uma parcela contratada pode ser fixa. Uma assinatura de streaming pouco usada pode ser revisada.",
    challengeTitle: "Para onde foi seu dinheiro?",
    challenge:
      "Aprenda a identificar gastos variáveis e descubra uma oportunidade de economia.",
    actionPrompt:
      "Depois de consultar seus dados, escreva qual decisão tomou sobre uma assinatura. Não informe o nome do serviço nem valores.",
    feedback:
      "Uma assinatura pouco utilizada pode ser revista sem comprometer despesas essenciais.",
    nextStep:
      "No aplicativo, o próximo passo seria consultar suas assinaturas e escolher se deseja revisar alguma delas.",
    question:
      "Qual dessas despesas costuma ser mais fácil de ajustar no curto prazo?",
    choices: [
      "Aluguel com contrato vigente",
      "Assinatura de streaming pouco utilizada",
      "Parcela obrigatória de financiamento",
    ],
    correctChoice: 1,
  },
  {
    week: 4,
    title: "Categorize seus gastos",
    lesson:
      "Organizar cada despesa em uma categoria ajuda a enxergar padrões e preparar um orçamento mais realista.",
    example:
      "Uma compra no mercado pode entrar em alimentação; uma corrida pode entrar em transporte.",
    challengeTitle: "Dê uma categoria a uma despesa",
    challenge:
      "Responda à pergunta, consulte o extrato e categorize pelo menos uma despesa.",
    feedback:
      "Boa! Categorias claras ajudam a tomar decisões com mais contexto.",
    question: "O que ajuda a entender melhor seus gastos?",
    choices: [
      "Agrupar cada despesa por categoria",
      "Ignorar compras pequenas",
      "Anotar somente as entradas",
    ],
    correctChoice: 0,
  },
  {
    week: 5,
    title: "Defina seus limites",
    lesson:
      "Limites ajudam a manter cada categoria dentro do que cabe na sua rotina, sem transformar o orçamento em punição.",
    example:
      "Se os pedidos por aplicativo aumentaram, você pode definir um limite que ainda permita momentos de lazer.",
    challengeTitle: "Escolha um limite possível",
    challenge:
      "Pense em uma categoria variável e escolha um limite que pareça realista para você.",
    feedback: "Um limite flexível e realista é mais fácil de revisar e manter.",
    question:
      "Se uma categoria passou do limite, qual é um bom primeiro passo?",
    choices: [
      "Entender o que mudou e ajustar o plano",
      "Pegar dinheiro emprestado para compensar",
      "Desistir de acompanhar o orçamento",
    ],
    correctChoice: 0,
  },
  {
    week: 6,
    title: "Entenda o cartão de crédito",
    lesson:
      "A fatura reúne compras e compromissos. Conhecer vencimento, valor total e condições ajuda a evitar surpresas.",
    example:
      "Pagar apenas uma parte da fatura pode gerar encargos sobre o restante. Confira as condições antes de decidir.",
    challengeTitle: "Leia uma fatura demonstrativa",
    challenge:
      "Identifique o valor total e o vencimento em uma fatura de exemplo. Não contrate nem altere produtos.",
    feedback:
      "Entender a fatura é um passo importante para usar crédito com atenção.",
    question: "O que é importante conferir na fatura?",
    choices: [
      "Valor total e vencimento",
      "Somente o limite disponível",
      "Apenas o nome do cartão",
    ],
    correctChoice: 0,
  },
  {
    week: 7,
    title: "Planeje seu salário",
    lesson:
      "Planejar o salário é decidir prioridades para o dinheiro que chega, antes que as despesas do mês apareçam.",
    example:
      "Você pode listar primeiro moradia, contas e transporte, e depois decidir como distribuir o restante.",
    challengeTitle: "Escolha suas prioridades",
    challenge:
      "Pense em duas despesas que precisam estar no seu plano assim que o salário chegar.",
    feedback:
      "Ter prioridades claras ajuda a distribuir o salário com mais intenção.",
    question: "Qual escolha ajuda a planejar o salário?",
    choices: [
      "Separar compromissos e prioridades",
      "Gastar tudo antes de conferir as contas",
      "Contar com uma renda que ainda não chegou",
    ],
    correctChoice: 0,
  },
  {
    week: 8,
    title: "Crie sua primeira meta",
    lesson:
      "Uma meta fica mais clara quando tem um motivo, um valor possível e um prazo que faça sentido para você.",
    example:
      "Um curso pode ser uma meta. Você escolhe quando pretende realizá-la e revê o plano conforme sua rotina.",
    challengeTitle: "Dê nome a uma meta",
    challenge:
      "Escolha algo que gostaria de realizar e descreva sua meta em uma frase. Não é necessário movimentar dinheiro.",
    feedback: "Sua meta tem um motivo e pode ser acompanhada no seu ritmo.",
    question: "O que deixa uma meta mais clara?",
    choices: [
      "Um motivo, um valor possível e um prazo",
      "Um prazo impossível de mudar",
      "Comparar seu objetivo com o de outras pessoas",
    ],
    correctChoice: 0,
  },
  {
    week: 9,
    title: "Conheça os Cofrinhos",
    lesson:
      "Separar um objetivo ajuda a acompanhar um plano. Antes de usar qualquer produto, leia regras, acesso ao dinheiro e condições.",
    example:
      "Você pode imaginar um cofrinho chamado 'material do curso'. Este exercício não movimenta dinheiro.",
    challengeTitle: "Crie um objetivo fictício",
    challenge: "Dê um nome a um objetivo que gostaria de acompanhar.",
    feedback:
      "Dar nome ao objetivo ajuda a lembrar por que ele importa para você.",
    question: "Para que serve separar um objetivo em um cofrinho?",
    choices: [
      "Acompanhar o plano para aquele objetivo",
      "Garantir um rendimento específico",
      "Evitar conferir as regras do produto",
    ],
    correctChoice: 0,
  },
  {
    week: 10,
    title: "Monte sua reserva",
    lesson:
      "Uma reserva é planejada para imprevistos. O tamanho e o ritmo dependem da realidade e das prioridades de cada pessoa.",
    example:
      "Uma despesa inesperada pode surgir em um mês apertado. Um plano pode ajudar você a pensar nos próximos passos.",
    challengeTitle: "Imagine um imprevisto",
    challenge:
      "Pense em um gasto inesperado e em uma forma segura de começar a se preparar, sem deixar compromissos essenciais de lado.",
    feedback:
      "Pensar antes não elimina imprevistos, mas ajuda a decidir com mais clareza.",
    question: "O que descreve melhor uma reserva de emergência?",
    choices: [
      "Um valor planejado para imprevistos",
      "Dinheiro que precisa ser investido em alto risco",
      "Uma garantia de que nunca haverá despesas inesperadas",
    ],
    correctChoice: 0,
  },
  {
    week: 11,
    title: "Aprenda sobre investimentos",
    lesson:
      "Investir envolve objetivo, prazo, condições e riscos. Nenhum resultado deve ser tratado como garantido.",
    example:
      "Um dinheiro necessário em breve pede análise diferente de um plano de longo prazo.",
    challengeTitle: "Compare três perguntas",
    challenge:
      "Ao pesquisar uma alternativa, procure entender risco, liquidez e como o resultado é calculado.",
    feedback:
      "Essas perguntas ajudam a entender uma oferta sem confundir expectativa com garantia.",
    question: "O que é importante comparar antes de investir?",
    choices: [
      "Risco, liquidez, prazo e condições",
      "Somente o maior retorno anunciado",
      "A recomendação de uma pessoa desconhecida",
    ],
    correctChoice: 0,
  },
  {
    week: 12,
    title: "Seu plano para o futuro",
    lesson:
      "Revisar o orçamento e escolher um próximo hábito ajuda a continuar depois da jornada. Os dias finais ficam para revisão e celebração.",
    example:
      "Você pode reservar alguns minutos no dia do pagamento para rever entradas, saídas e uma meta.",
    challengeTitle: "Escolha seu próximo passo",
    challenge:
      "Complete: 'Nos próximos 90 dias, vou acompanhar minhas finanças fazendo...' Escolha algo simples e específico.",
    feedback:
      "Você chegou ao fim das etapas. Continue com os hábitos que fazem sentido para a sua realidade.",
    question: "Qual hábito ajuda a continuar depois da jornada?",
    choices: [
      "Revisar o orçamento em um momento recorrente",
      "Parar de acompanhar depois de uma semana difícil",
      "Usar o progresso como medida de saúde financeira",
    ],
    correctChoice: 0,
  },
];

function dateToUtcDay(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

export function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createJourneyProgress(today = new Date()): JourneyProgress {
  return {
    startedOn: getLocalDateKey(today),
    completedWeeks: [],
    selectedAnswers: {},
    actionNotes: {},
    history: [],
    redeemedCoupons: [],
    personalGoals: [],
  };
}

export function normalizeJourneyProgress(
  value: unknown,
  today = new Date(),
): JourneyProgress {
  const emptyProgress = createJourneyProgress(today);
  if (!value || typeof value !== "object") return emptyProgress;

  const candidate = value as Partial<JourneyProgress> & {
    completedWeeks?: unknown;
  };
  const validDate =
    typeof candidate.startedOn === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(candidate.startedOn) &&
    !Number.isNaN(new Date(`${candidate.startedOn}T00:00:00`).getTime());
  const rawWeeks = Array.isArray(candidate.completedWeeks)
    ? candidate.completedWeeks
    : [];
  const completedWeeks = [
    ...new Set(
      rawWeeks
        .filter(
          (week): week is number =>
            Number.isInteger(week) && week >= 1 && week <= 13,
        )
        .map((week) => (week === 13 ? 12 : week)),
    ),
  ].sort((first, second) => first - second);
  const selectedAnswers =
    candidate.selectedAnswers && typeof candidate.selectedAnswers === "object"
      ? Object.fromEntries(
          Object.entries(candidate.selectedAnswers).filter(
            ([week, choice]) =>
              Number(week) >= 1 &&
              Number(week) <= JOURNEY_LENGTH_WEEKS &&
              Number.isInteger(choice),
          ),
        )
      : {};
  const actionNotes =
    candidate.actionNotes && typeof candidate.actionNotes === "object"
      ? Object.fromEntries(
          Object.entries(candidate.actionNotes).filter(
            ([week, note]) =>
              Number(week) >= 1 &&
              Number(week) <= JOURNEY_LENGTH_WEEKS &&
              typeof note === "string",
          ),
        )
      : {};
  const history = Array.isArray(candidate.history)
    ? candidate.history.filter((event): event is JourneyHistoryEntry =>
        Boolean(
          event &&
          typeof event === "object" &&
          "id" in event &&
          typeof event.id === "string" &&
          "title" in event &&
          typeof event.title === "string" &&
          "detail" in event &&
          typeof event.detail === "string" &&
          "date" in event &&
          typeof event.date === "string",
        ),
      )
    : [];
  const redeemedCoupons = Array.isArray(candidate.redeemedCoupons)
    ? candidate.redeemedCoupons.filter(
        (coupon): coupon is string => typeof coupon === "string",
      )
    : [];
  const personalGoals = Array.isArray(candidate.personalGoals)
    ? candidate.personalGoals.filter((goal): goal is PersonalGoal =>
        Boolean(
          goal &&
          typeof goal === "object" &&
          "id" in goal &&
          typeof goal.id === "string" &&
          "title" in goal &&
          typeof goal.title === "string" &&
          "createdOn" in goal &&
          typeof goal.createdOn === "string" &&
          (!("completedOn" in goal) || typeof goal.completedOn === "string"),
        ),
      )
    : [];

  return {
    startedOn: validDate ? candidate.startedOn! : emptyProgress.startedOn,
    completedWeeks,
    selectedAnswers,
    actionNotes,
    history,
    redeemedCoupons,
    personalGoals,
  };
}

export function ensureWeekFourDemoProgress(
  progress: JourneyProgress,
  today = new Date(),
): JourneyProgress {
  const hasSeededWeeks = [1, 2, 3].every((week) =>
    progress.completedWeeks.includes(week),
  );

  if (hasSeededWeeks) return progress;

  const daysSinceMonday = (today.getDay() + 6) % 7;
  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - daysSinceMonday - 21,
  );
  const startedOn = getLocalDateKey(startDate);
  const toDateKey = (daysAfterStart: number) =>
    new Date((dateToUtcDay(startedOn) + daysAfterStart) * 86_400_000)
      .toISOString()
      .slice(0, 10);
  const seededHistory = journeyStages.slice(0, 3).map((stage) => ({
    id: `week-${stage.week}-${toDateKey(stage.week * 7)}`,
    title: `Semana ${stage.week} concluída`,
    detail: `${stage.title} · +10 moedas`,
    date: toDateKey(stage.week * 7),
  }));
  const completedWeeks = [
    ...new Set([1, 2, 3, ...progress.completedWeeks]),
  ].sort((first, second) => first - second);

  return {
    ...progress,
    startedOn,
    completedWeeks,
    selectedAnswers: {
      ...progress.selectedAnswers,
      1: journeyStages[0].correctChoice,
      2: journeyStages[1].correctChoice,
      3: journeyStages[2].correctChoice,
    },
    actionNotes: {
      ...progress.actionNotes,
      1: "Identifiquei uma fonte de entrada.",
      2: "Revisei minhas categorias de gasto.",
      3: "Observei um gasto variável que posso rever.",
    },
    history: [...seededHistory, ...progress.history],
  };
}

export function getElapsedJourneyDays(
  startedOn: string,
  today = new Date(),
): number {
  const elapsed =
    dateToUtcDay(getLocalDateKey(today)) - dateToUtcDay(startedOn);
  return Math.max(0, elapsed);
}

function mondayOfWeek(dateKey: string): number {
  const dayNumber = dateToUtcDay(dateKey);
  const dayOfWeek = new Date(dayNumber * 86_400_000).getUTCDay();
  return dayNumber - ((dayOfWeek + 6) % 7);
}

export function getJourneyDay(startedOn: string, today = new Date()): number {
  return Math.min(
    JOURNEY_LENGTH_DAYS,
    getElapsedJourneyDays(startedOn, today) + 1,
  );
}

export function getUnlockedWeeks(
  startedOn: string,
  today = new Date(),
): number {
  const currentWeekStart = mondayOfWeek(getLocalDateKey(today));
  const startWeek = mondayOfWeek(startedOn);
  const elapsedWeeks = Math.max(
    0,
    Math.floor((currentWeekStart - startWeek) / 7),
  );

  return Math.min(JOURNEY_LENGTH_WEEKS, elapsedWeeks + 1);
}

export function getDaysUntilNextChallenge(today = new Date()): number {
  const dayOfWeek = today.getDay();
  return dayOfWeek === 1 ? 7 : (8 - dayOfWeek) % 7;
}

export function getJourneyCoins(progress: JourneyProgress): number {
  return progress.completedWeeks.length * COINS_PER_CHALLENGE;
}

export function hasRecordedChallengeAction(note: string): boolean {
  return note.trim().length >= MIN_ACTION_NOTE_LENGTH;
}

export function isJourneyRewardReady(
  progress: JourneyProgress,
  today = new Date(),
): boolean {
  const allStagesComplete = journeyStages.every((stage) =>
    progress.completedWeeks.includes(stage.week),
  );

  return (
    allStagesComplete &&
    getElapsedJourneyDays(progress.startedOn, today) >= JOURNEY_LENGTH_DAYS
  );
}
