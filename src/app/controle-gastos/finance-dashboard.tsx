"use client";

import {
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Coins,
  ExternalLink,
  History,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
  TrendingDown,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import JourneyDataPreview from "@/app/components/journey-data-preview";
import { demoBalance, demoMovements, demoPreviousMovements } from "@/lib/demo-data";
import {
  formatCurrency,
  getExpensesByCategory,
  getMovementTotals,
  MOVEMENT_CATEGORIES_STORAGE_KEY,
  MOVEMENT_CATEGORY_CHALLENGE_KEY,
} from "@/lib/finance";
import {
  createJourneyProgress,
  ensureWeekFourDemoProgress,
  getDaysUntilNextChallenge,
  getJourneyCoins,
  getJourneyDay,
  getLocalDateKey,
  getUnlockedWeeks,
  JOURNEY_LENGTH_WEEKS,
  JOURNEY_STORAGE_KEY,
  journeyStages,
  normalizeJourneyProgress,
  rewardCoupons,
  WALLET_COUPON_HIGHLIGHT_KEY,
  type JourneyStage,
  type JourneyProgress,
} from "@/lib/gamification";
import styles from "./finance-dashboard.module.css";

type Period = "30 dias" | "90 dias";
type ChallengeOptionProps = Readonly<{
  week: number;
  title: string;
  completed: boolean;
}>;

const currentCategories = getExpensesByCategory(demoMovements);
const previousCategories = getExpensesByCategory(demoPreviousMovements);
const categoryColors = ["#ec7000", "#d49a35", "#43836d", "#507a94", "#9d6547"];

function getMotivation(completedCount: number): string {
  if (completedCount === JOURNEY_LENGTH_WEEKS) return "12 desafios? Você zerou essa jornada. Que orgulho!";
  if (completedCount >= 9) return "Olha só você chegando longe. Mais um passo e a conquista vem.";
  if (completedCount >= 4) return "Seu ritmo está funcionando. Bora para o próximo desafio?";
  if (completedCount > 0) return "Um desafio por vez. Você está construindo um hábito de verdade.";
  return "Toda grande mudança começa com um passo pequeno. Vamos nessa?";
}

function readProgress(): JourneyProgress {
  try {
    const storedProgress = localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (storedProgress) return ensureWeekFourDemoProgress(normalizeJourneyProgress(JSON.parse(storedProgress)));
  } catch {
    return ensureWeekFourDemoProgress(createJourneyProgress());
  }

  return ensureWeekFourDemoProgress(createJourneyProgress());
}

function resetDemoProgress() {
  localStorage.removeItem(JOURNEY_STORAGE_KEY);
  localStorage.removeItem(MOVEMENT_CATEGORIES_STORAGE_KEY);
  localStorage.removeItem(MOVEMENT_CATEGORY_CHALLENGE_KEY);
  sessionStorage.removeItem(WALLET_COUPON_HIGHLIGHT_KEY);
  window.location.href = "/controle-gastos";
}

function ChallengeOption({ week, title, completed }: ChallengeOptionProps) {
  return (
    <option value={week}>
      Semana {week} · {title}{completed ? " · concluído" : ""}
    </option>
  );
}

type WeeklyChallengeActivityProps = Readonly<{
  stage: JourneyStage;
  completed: boolean;
  selectedAnswer: number | undefined;
  message: string;
  onChoose: (choice: number) => void;
  onSubmit: () => void;
}>;

function WeeklyChallengeActivity({
  stage,
  completed,
  selectedAnswer,
  message,
  onChoose,
  onSubmit,
}: WeeklyChallengeActivityProps) {
  if (completed) {
    return (
      <>
        <JourneyDataPreview />
        <fieldset className={styles.answerOptions} disabled>
          <legend>{stage.question}</legend>
          {stage.choices.map((choice, index) => (
            <label className={selectedAnswer === index ? styles.answerSelected : ""} key={choice}>
              <input type="radio" name={`finance-week-${stage.week}`} checked={selectedAnswer === index} readOnly />
              <span>{choice}</span>
            </label>
          ))}
        </fieldset>
        <output className={styles.correctFeedback} aria-live="polite">
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>
            <strong>{stage.week === 3 ? "Resposta correta!" : "Desafio concluído!"}</strong>
            {" "}{stage.feedback}
            {stage.nextStep && <small>{stage.nextStep}</small>}
          </span>
        </output>
      </>
    );
  }

  return (
    <>
      <fieldset className={styles.answerOptions}>
        <legend>{stage.question}</legend>
        {stage.choices.map((choice, index) => (
          <label className={selectedAnswer === index ? styles.answerSelected : ""} key={choice}>
            <input
              type="radio"
              name={`finance-week-${stage.week}`}
              checked={selectedAnswer === index}
              onChange={() => onChoose(index)}
            />
            <span>{choice}</span>
          </label>
        ))}
      </fieldset>
      <JourneyDataPreview />
      {message && <output className={styles.challengeMessage} aria-live="polite">{message}</output>}
      <button className={styles.answerButton} type="button" disabled={selectedAnswer === undefined} onClick={onSubmit}>
        Responder <ArrowRight size={16} aria-hidden="true" />
      </button>
    </>
  );
}

export default function FinanceDashboard() {
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [period, setPeriod] = useState<Period>("30 dias");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [challengeMessage, setChallengeMessage] = useState("");
  const [pageNotice, setPageNotice] = useState("");
  const [walletNotice, setWalletNotice] = useState(false);

  useEffect(() => {
    const loaded = readProgress();
    const unlocked = getUnlockedWeeks(loaded.startedOn);
    const firstPending = journeyStages.find(
      (stage) => stage.week <= unlocked && !loaded.completedWeeks.includes(stage.week),
    )?.week ?? unlocked;

    setProgress(loaded);
    setSelectedWeek(firstPending);
  }, []);

  useEffect(() => {
    if (!progress) return;

    try {
      localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      setPageNotice("O navegador não permitiu salvar o progresso. Ele continua disponível nesta sessão.");
    }
  }, [progress]);

  useEffect(() => {
    if (!progress || !window.location.search.includes("challenge=week-4-complete")) return;
    if (!localStorage.getItem(MOVEMENT_CATEGORY_CHALLENGE_KEY) || progress.completedWeeks.includes(4)) return;
    const date = getLocalDateKey(new Date());
    const coinsBefore = getJourneyCoins(progress);
    const completedProgress = {
      ...progress,
      completedWeeks: [...progress.completedWeeks, 4].sort((first, second) => first - second),
      history: [...progress.history, { id: `week-4-${date}`, title: "Semana 4 concluída", detail: "Categorize seus gastos · +10 moedas", date }],
    };
    const coinsAfter = getJourneyCoins(completedProgress);
    const unlockedCoupon = rewardCoupons.find(
      (coupon) => coupon.coinsRequired > coinsBefore && coupon.coinsRequired <= coinsAfter,
    );
    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(completedProgress));
    setProgress(completedProgress);
    setPageNotice(
      unlockedCoupon
        ? `Desafio concluído! +10 moedas. ${unlockedCoupon.title} desbloqueado.`
        : "Desafio concluído! +10 moedas.",
    );
    setWalletNotice(true);
    if (unlockedCoupon) sessionStorage.setItem(WALLET_COUPON_HIGHLIGHT_KEY, unlockedCoupon.id);
    window.history.replaceState({}, "", "/controle-gastos");
  }, [progress]);

  if (!progress) {
    return <main className={styles.loading} aria-busy="true">Preparando sua jornada...</main>;
  }

  const today = new Date();
  const completedCount = progress.completedWeeks.length;
  const completionPercent = Math.round((completedCount / JOURNEY_LENGTH_WEEKS) * 100);
  const coins = getJourneyCoins(progress);
  const unlockedWeeks = getUnlockedWeeks(progress.startedOn, today);
  const availableStages = journeyStages.filter((stage) => stage.week <= unlockedWeeks);
  const stage = availableStages.find((item) => item.week === selectedWeek)
    ?? availableStages.find((item) => !progress.completedWeeks.includes(item.week))
    ?? journeyStages[0];
  const stageComplete = progress.completedWeeks.includes(stage.week);
  const selectedAnswer = progress.selectedAnswers[String(stage.week)];
  const activeMilestone = completedCount > 0 ? Math.floor(completedCount / 3) * 25 : 0;
  const currentTotals = getMovementTotals(demoMovements);
  const previousTotals = getMovementTotals(demoPreviousMovements);
  const currentExpenses = period === "90 dias" ? currentTotals.expenses * 3 : currentTotals.expenses;
  const previousExpenses = period === "90 dias" ? previousTotals.expenses * 3 : previousTotals.expenses;
  const comparison = previousExpenses
    ? Math.round(((currentExpenses - previousExpenses) / previousExpenses) * 100)
    : 0;
  const projectionEstimate = 145;
  const projectedBalance = demoBalance - currentTotals.expenses - projectionEstimate;
  const journeyDay = getJourneyDay(progress.startedOn, today);
  const nextChallengeDays = getDaysUntilNextChallenge(today);

  function updateNotice(message: string) {
    setPageNotice(message);
    setWalletNotice(false);
    window.setTimeout(() => setPageNotice(""), 3600);
  }

  function saveAnswer(choice: number) {
    setChallengeMessage("");
    setProgress((current) => current && ({
      ...current,
      selectedAnswers: { ...current.selectedAnswers, [String(stage.week)]: choice },
    }));
  }

  function submitChallenge() {
    if (selectedAnswer === undefined || stageComplete) return;
    if (selectedAnswer !== stage.correctChoice) {
      setChallengeMessage("Quase! Revise a dica e tente de novo. Você não perde moedas.");
      return;
    }

    if (stage.week === 4 && !localStorage.getItem(MOVEMENT_CATEGORY_CHALLENGE_KEY)) {
      window.location.href = "/extrato?challenge=week-4";
      return;
    }

    const date = getLocalDateKey(new Date());
    setProgress((current) => {
      if (!current || current.completedWeeks.includes(stage.week)) return current;
      const completedWeeks = [...current.completedWeeks, stage.week].sort((first, second) => first - second);
      const nextPercent = Math.round((completedWeeks.length / JOURNEY_LENGTH_WEEKS) * 100);
      const history = [{
        id: `week-${stage.week}-${date}`,
        title: `Semana ${stage.week} concluída`,
        detail: `${stage.title} · +10 moedas`,
        date,
      }];

      if ([25, 50, 75, 100].includes(nextPercent)) {
        history.push({
          id: `milestone-${nextPercent}-${date}`,
          title: `Marco de ${nextPercent}% alcançado`,
          detail: "Conquista pronta para compartilhar",
          date,
        });
      }

      return { ...current, completedWeeks, history: [...current.history, ...history] };
    });
    setChallengeMessage(stage.feedback);
  }

  function addPersonalGoal(goalValue: string) {
    const title = goalValue.trim();
    if (!title) return;

    const date = getLocalDateKey(new Date());
    setProgress((current) => current && ({
      ...current,
      personalGoals: [...current.personalGoals, { id: `goal-${Date.now()}`, title, createdOn: date }],
      history: [...current.history, {
        id: `goal-created-${Date.now()}`,
        title: "Nova meta pessoal criada",
        detail: "Meta adicionada à sua jornada",
        date,
      }],
    }));
    setGoalTitle("");
  }

  function completePersonalGoal(goalId: string) {
    const date = getLocalDateKey(new Date());
    setProgress((current) => {
      if (!current) return current;
      const goal = current.personalGoals.find((item) => item.id === goalId);
      if (!goal || goal.completedOn) return current;

      return {
        ...current,
        personalGoals: current.personalGoals.map((item) => item.id === goalId ? { ...item, completedOn: date } : item),
        history: [...current.history, {
          id: `goal-completed-${goalId}`,
          title: "Meta pessoal concluída",
          detail: "Conquista pessoal pronta para compartilhar",
          date,
        }],
      };
    });
  }

  async function shareProgress(goalCompleted = false) {
    const percent = completionPercent;
    const goalMessage = goalCompleted ? "\nVocê também concluiu uma meta pessoal!" : "";
    const milestoneMessage = `Você já completou ${percent}% da jornada!\nSeu esforço merece ser comemorado. Compartilhe sua evolução!${goalMessage}\n#MinhaJornadaItaú`;
    const shareUrl = `${window.location.origin}/jornada?ref=MINHAJORNADA`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Minha jornada IA.I", text: milestoneMessage, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(`${milestoneMessage}\n${shareUrl}`);
        updateNotice("Cartão de conquista copiado. Nenhum dado financeiro foi compartilhado.");
      }
    } catch {
      updateNotice("Não foi possível compartilhar agora. Tente novamente.");
    }
  }

  function sendChatMessage() {
    const trimmedMessage = chatText.trim();
    if (!trimmedMessage) return;
    setChatReply("Posso ajudar você a entender categorias e comparar períodos. Este protótipo usa apenas movimentações demonstrativas.");
    setChatText("");
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>IA.I FINANÇAS · DESAFIO DA SEMANA {unlockedWeeks}</span>
          <h1>Oi, Ana! <span>{getMotivation(completedCount)}</span></h1>
        </div>
        <div className={styles.headerSide}>
          <span className={styles.dayBadge}>Dia {journeyDay} de 90</span>
          <button className={styles.resetButton} type="button" onClick={resetDemoProgress}>Reiniciar demonstração</button>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.journeySummary} aria-labelledby="journey-progress-title">
          <div className={styles.summaryTop}>
            <div>
              <span className={styles.sectionEyebrow}>SUA JORNADA</span>
              <h2 id="journey-progress-title">{completionPercent}% concluídos</h2>
              <p>{completedCount} de {JOURNEY_LENGTH_WEEKS} desafios · Semana {unlockedWeeks}</p>
            </div>
            <div className={styles.coinBalance}><Coins size={20} aria-hidden="true" /><strong>{coins}</strong><span>moedas</span></div>
          </div>
          <progress className={styles.journeyProgress} value={completedCount} max={JOURNEY_LENGTH_WEEKS} aria-label="Percentual dos desafios concluídos" />
          <div className={styles.summaryActions}>
            <button type="button" onClick={() => shareProgress()}><Share2 size={15} aria-hidden="true" /> Compartilhar conquista</button>
            <button type="button" onClick={() => setHistoryOpen(true)}><History size={15} aria-hidden="true" /> Histórico de evolução</button>
            <span><Clock3 size={14} aria-hidden="true" /> Próximo desafio em {nextChallengeDays} {nextChallengeDays === 1 ? "dia" : "dias"}</span>
          </div>
          <p className={styles.progressClarification}>Este percentual mede os desafios concluídos, não sua saúde financeira.</p>
        </section>

        <section className={styles.shareCard} aria-label="Cartão de conquista compartilhável">
          <div>
            <span className={styles.shareKicker}><Sparkles size={14} aria-hidden="true" /> {activeMilestone ? "CONQUISTA DESBLOQUEADA" : "SEU PRÓXIMO MARCO"}</span>
            <h2>Você já completou {completionPercent}% da jornada!</h2>
            <p>Seu esforço merece ser comemorado. Compartilhe sua evolução!</p>
            <strong>#MinhaJornadaItaú</strong>
          </div>
          <button type="button" aria-label="Compartilhar cartão de conquista" onClick={() => shareProgress()}><Share2 size={18} aria-hidden="true" /></button>
        </section>

        <section className={styles.challengeCard} aria-labelledby="weekly-challenge-title">
          <div className={styles.challengeHeader}>
            <div>
              <span className={styles.challengeKicker}><Sparkles size={14} aria-hidden="true" /> DESAFIO DA SEMANA {stage.week}</span>
              <h2 id="weekly-challenge-title">{stage.challengeTitle}</h2>
            </div>
            <span className={styles.timeBadge}><Clock3 size={13} aria-hidden="true" /> 2 min</span>
          </div>
          <p className={styles.challengeDescription}>{stage.challenge}</p>
          {availableStages.length > 1 && (
            <label className={styles.challengePicker}>
              <span>Desafio ativo</span>
              <select value={stage.week} onChange={(event) => { setSelectedWeek(Number(event.target.value)); setChallengeMessage(""); }}>
                {availableStages.map((item) => (
                  <ChallengeOption
                    key={item.week}
                    week={item.week}
                    title={item.title}
                    completed={progress.completedWeeks.includes(item.week)}
                  />
                ))}
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </label>
          )}
          <WeeklyChallengeActivity
            stage={stage}
            completed={stageComplete}
            selectedAnswer={selectedAnswer}
            message={challengeMessage}
            onChoose={saveAnswer}
            onSubmit={submitChallenge}
          />
          <p className={styles.resumeNote}>Sua resposta fica salva. Pode sair e retomar depois, sem perder pontos.</p>
        </section>

        <section className={styles.healthPanel} aria-labelledby="health-title">
          <div className={styles.panelHeading}>
            <div><span className={styles.sectionEyebrow}>SEUS DADOS</span><h2 id="health-title">Saúde financeira</h2></div>
            <label className={styles.periodPicker}><span className={styles.visuallyHidden}>Comparar período</span><select value={period} onChange={(event) => setPeriod(event.target.value as Period)}><option>30 dias</option><option>90 dias</option></select><ChevronDown size={14} aria-hidden="true" /></label>
          </div>
          <div className={styles.periodComparison}>
            <span>{period} <small>movimentações simuladas</small></span>
            <strong>{formatCurrency(currentExpenses)}</strong>
            <span className={comparison <= 0 ? styles.comparisonPositive : styles.comparisonNeutral}>
              {comparison <= 0 ? <TrendingDown size={14} aria-hidden="true" /> : <ArrowDownRight size={14} aria-hidden="true" />}
              {comparison > 0 ? "+" : ""}{comparison}% vs. período anterior
            </span>
          </div>
          <ul className={styles.categoryRows}>
            {currentCategories.slice(0, 4).map((category, index) => {
              const previous = previousCategories.find((item) => item.category === category.category)?.total ?? 0;
              const currentValue = category.total * (period === "90 dias" ? 3 : 1);
              const previousValue = previous * (period === "90 dias" ? 3 : 1);
              const share = currentExpenses ? (currentValue / currentExpenses) * 100 : 0;

              return (
                <li key={category.category}>
                  <div className={styles.categoryRowTop}><span><i style={{ backgroundColor: categoryColors[index % categoryColors.length] }} />{category.category}</span><strong>{formatCurrency(currentValue)}</strong></div>
                  <div className={styles.categoryTrack}><span style={{ width: `${share}%`, backgroundColor: categoryColors[index % categoryColors.length] }} /></div>
                  <small>Período anterior: {formatCurrency(previousValue)}</small>
                </li>
              );
            })}
          </ul>
          <Link className={styles.statementLink} href="/extrato">Ver extrato detalhado <ExternalLink size={14} aria-hidden="true" /></Link>
          <div className={styles.projection}>
            <span className={styles.projectionIcon}><Clock3 size={16} aria-hidden="true" /></span>
            <div><strong>Projeção até o próximo salário</strong><small>Em 12 dias · estimativa, não é saldo garantido</small><span>Confirmado: {formatCurrency(currentTotals.expenses)} <i /> Estimativa: {formatCurrency(projectionEstimate)}</span></div>
            <strong className={styles.projectedValue}>{formatCurrency(projectedBalance)}</strong>
          </div>
        </section>

        <section className={styles.goalsPanel} aria-labelledby="goals-title">
          <div className={styles.panelHeading}>
            <div><span className={styles.sectionEyebrow}>SEU PRÓXIMO PASSO</span><h2 id="goals-title">Metas pessoais</h2></div>
            <Sparkles size={17} aria-hidden="true" />
          </div>
          <form className={styles.goalForm} onSubmit={(event) => { event.preventDefault(); addPersonalGoal(goalTitle); }}>
            <label htmlFor="personal-goal">O que você quer conquistar?</label>
            <div><input id="personal-goal" maxLength={60} value={goalTitle} onChange={(event) => setGoalTitle(event.target.value)} placeholder="Escreva uma meta, sem valores financeiros" /><button type="submit" disabled={!goalTitle.trim()}>Adicionar</button></div>
          </form>
          {progress.personalGoals.length > 0 && (
            <ul className={styles.goalList}>
              {progress.personalGoals.map((goal) => (
                <li key={goal.id}>
                  <span className={goal.completedOn ? styles.goalCompleteIcon : styles.goalPendingIcon}>{goal.completedOn ? <CheckCircle2 size={17} aria-hidden="true" /> : <Clock3 size={17} aria-hidden="true" />}</span>
                  <span><strong>{goal.title}</strong><small>{goal.completedOn ? "Concluída" : "Em andamento"}</small></span>
                  {goal.completedOn ? (
                    <button className={styles.goalShareButton} type="button" onClick={() => shareProgress(true)}><Share2 size={14} aria-hidden="true" /> Compartilhar meta</button>
                  ) : (
                    <button className={styles.goalCompleteButton} type="button" onClick={() => completePersonalGoal(goal.id)}>Concluir meta</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <Link className={styles.walletLink} href="/recompensas">
          <span className={styles.walletIcon}><Coins size={19} aria-hidden="true" /></span>
          <span><strong>Sua carteira de moedas</strong><small>{coins} moedas · cupons e conquistas</small></span>
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <button className={styles.chatFab} type="button" aria-label={chatOpen ? "Fechar conversa com a IA.I" : "Abrir conversa com a IA.I"} onClick={() => setChatOpen((open) => !open)}>
        {chatOpen ? <X size={21} aria-hidden="true" /> : <MessageCircle size={21} aria-hidden="true" />}
      </button>

      {chatOpen && (
        <section className={styles.chatPanel} aria-label="Conversa com a IA.I">
          <header><span><Sparkles size={15} aria-hidden="true" /> IA.I</span><button type="button" aria-label="Fechar chat" onClick={() => setChatOpen(false)}><X size={17} aria-hidden="true" /></button></header>
          <p className={styles.chatGreeting}>Precisa de ajuda? A ia.i está aqui para ajudar você a entender seus gastos e decidir seu próximo passo.</p>
          {chatReply && <p className={styles.chatReply}>{chatReply}</p>}
          <form onSubmit={(event) => { event.preventDefault(); sendChatMessage(); }}>
            <input aria-label="Sua mensagem" placeholder="Pergunte sobre seus gastos" value={chatText} onChange={(event) => setChatText(event.target.value)} />
            <button type="submit" aria-label="Enviar mensagem"><Send size={17} aria-hidden="true" /></button>
          </form>
        </section>
      )}

      {historyOpen && (
        <div className={styles.modalBackdrop}>
          <dialog open className={styles.historyDialog} aria-labelledby="history-title">
            <header><div><span className={styles.sectionEyebrow}>SUA EVOLUÇÃO</span><h2 id="history-title">Histórico de conquistas</h2></div><button type="button" aria-label="Fechar histórico" onClick={() => setHistoryOpen(false)}><X size={18} aria-hidden="true" /></button></header>
            {progress.history.length ? (
              <ol>{[...progress.history].reverse().map((entry) => <li key={entry.id}><CheckCircle2 size={16} aria-hidden="true" /><span><strong>{entry.title}</strong><small>{entry.detail}</small></span><time>{entry.date}</time></li>)}</ol>
            ) : <p>Suas conquistas vão aparecer aqui. O primeiro desafio já está te esperando.</p>}
          </dialog>
        </div>
      )}
      {pageNotice && (walletNotice ? (
        <Link className={styles.notice} href="/recompensas" aria-label="Abrir carteira de moedas">
          <span>{pageNotice}</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      ) : <output className={styles.notice} aria-live="polite">{pageNotice}</output>)}
    </main>
  );
}