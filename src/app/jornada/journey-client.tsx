"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Gift,
  LockKeyhole,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import JourneyDataPreview from "@/app/components/journey-data-preview";
import { MOVEMENT_CATEGORY_CHALLENGE_KEY } from "@/lib/finance";
import {
  createJourneyProgress,
  ensureWeekFourDemoProgress,
  getDaysUntilNextChallenge,
  getJourneyCoins,
  getJourneyDay,
  getElapsedJourneyDays,
  getLocalDateKey,
  getUnlockedWeeks,
  isJourneyRewardReady,
  JOURNEY_LENGTH_DAYS,
  JOURNEY_LENGTH_WEEKS,
  JOURNEY_STORAGE_KEY,
  journeyPhases,
  journeyStages,
  normalizeJourneyProgress,
  type JourneyStage,
  type JourneyProgress,
} from "@/lib/gamification";
import styles from "./journey.module.css";

function readJourneyProgress(): JourneyProgress {
  try {
    const storedValue = localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (storedValue) return ensureWeekFourDemoProgress(normalizeJourneyProgress(JSON.parse(storedValue)));
  } catch {
    return ensureWeekFourDemoProgress(createJourneyProgress());
  }

  return ensureWeekFourDemoProgress(createJourneyProgress());
}

function getStageDayRange(week: number): string {
  const firstDay = (week - 1) * 7 + 1;
  const lastDay = Math.min(week * 7, JOURNEY_LENGTH_DAYS);
  return `Dias ${firstDay}–${lastDay}`;
}

function getJourneyStatusText(periodComplete: boolean, day: number, daysToNextStage: number): string {
  if (periodComplete) return "Período de 90 dias concluído";
  if (day >= JOURNEY_LENGTH_DAYS) return "Último dia da jornada";

  const dayLabel = daysToNextStage === 1 ? "dia" : "dias";
  return `Próxima etapa em ${daysToNextStage} ${dayLabel}`;
}

function getRewardMessage(rewardReady: boolean, completedCount: number): string {
  if (rewardReady) {
    return "Você concluiu as 12 etapas e chegou ao dia 90. A recompensa desta experiência continua sendo apenas uma simulação.";
  }

  if (completedCount === journeyStages.length) {
    return "Você concluiu as 12 etapas. A recompensa demonstrativa só aparece após o período completo de 90 dias.";
  }

  return "A experiência de recompensa é simulada e depende da conclusão das 12 etapas e do período de 90 dias.";
}

type StageSelectorProps = Readonly<{
  stage: JourneyStage;
  isCurrent: boolean;
  isUnlocked: boolean;
  isComplete: boolean;
  isOverdue: boolean;
  onSelect: () => void;
}>;

function StageSelector({
  stage,
  isCurrent,
  isUnlocked,
  isComplete,
  isOverdue,
  onSelect,
}: StageSelectorProps) {
  let markerContent: ReactNode = String(stage.week).padStart(2, "0");
  let statusLabel = isOverdue ? "Em aberto, sem prazo perdido" : "Disponível nesta semana";
  let accessibleStatus = "Etapa disponível.";

  if (isComplete) {
    markerContent = <Check size={14} aria-hidden="true" />;
    statusLabel = "Etapa concluída";
    accessibleStatus = "Etapa concluída.";
  } else if (!isUnlocked) {
    markerContent = <LockKeyhole size={12} aria-hidden="true" />;
    statusLabel = `Disponível no ${getStageDayRange(stage.week).replace("Dias ", "dia ").split("–")[0]}`;
    accessibleStatus = "Etapa bloqueada.";
  }

  return (
    <button
      className={`${styles.weekButton} ${isCurrent ? styles.weekSelected : ""} ${!isUnlocked ? styles.weekLocked : ""}`}
      type="button"
      disabled={!isUnlocked}
      aria-current={isCurrent ? "step" : undefined}
      aria-label={`Semana ${stage.week}: ${stage.title}. ${accessibleStatus}`}
      onClick={onSelect}
    >
      <span className={`${styles.weekMarker} ${isComplete ? styles.markerComplete : ""} ${!isUnlocked ? styles.markerLocked : ""}`}>
        {markerContent}
      </span>
      <span className={styles.weekCopy}>
        <span className={styles.weekMeta}>SEMANA {String(stage.week).padStart(2, "0")} <small>{getStageDayRange(stage.week)}</small></span>
        <strong>{stage.title}</strong>
        <small className={styles.weekStatus}>{statusLabel}</small>
      </span>
      {isUnlocked && <ArrowRight className={styles.weekArrow} size={15} aria-hidden="true" />}
    </button>
  );
}

export default function JourneyClient() {
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [answerFeedback, setAnswerFeedback] = useState("");

  useEffect(() => {
    const loadedProgress = readJourneyProgress();
    const unlockedWeeks = getUnlockedWeeks(loadedProgress.startedOn);
    const firstOpenWeek = journeyStages.find(
      (stage) => stage.week <= unlockedWeeks && !loadedProgress.completedWeeks.includes(stage.week),
    )?.week ?? unlockedWeeks;

    setProgress(loadedProgress);
    setSelectedWeek(firstOpenWeek);
  }, []);

  useEffect(() => {
    if (!progress) return;

    try {
      localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // A jornada continua utilizável nesta sessão mesmo se o navegador bloquear armazenamento.
    }
  }, [progress]);

  if (!progress) {
    return (
      <main className={styles.loading} aria-busy="true" aria-label="Preparando sua jornada">
        <span />
        <p>Preparando sua jornada...</p>
      </main>
    );
  }

  const today = new Date();
  const day = getJourneyDay(progress.startedOn, today);
  const periodComplete = getElapsedJourneyDays(progress.startedOn, today) >= JOURNEY_LENGTH_DAYS;
  const unlockedWeeks = getUnlockedWeeks(progress.startedOn, today);
  const selectedStage = journeyStages[selectedWeek - 1];
  const completedCount = progress.completedWeeks.length;
  const completionPercent = Math.round((completedCount / journeyStages.length) * 100);
  const coins = getJourneyCoins(progress);
  const rewardReady = isJourneyRewardReady(progress, today);
  const daysToNextStage = getDaysUntilNextChallenge(today);
  const journeyStatus = getJourneyStatusText(periodComplete, day, daysToNextStage);
  const rewardMessage = getRewardMessage(rewardReady, completedCount);
  const selectedStageComplete = progress.completedWeeks.includes(selectedWeek);
  const selectedAnswer = progress.selectedAnswers[String(selectedWeek)];

  function saveSelectedAnswer(choice: number) {
    setAnswerFeedback("");
    setProgress((current) => current && ({
      ...current,
      selectedAnswers: { ...current.selectedAnswers, [String(selectedWeek)]: choice },
    }));
  }

  function submitSelectedStage() {
    if (!selectedStage || selectedWeek > unlockedWeeks || selectedStageComplete || selectedAnswer === undefined) return;
    if (selectedAnswer !== selectedStage.correctChoice) {
      setAnswerFeedback("Ainda não. Revise a dica e tente de novo, sem perder moedas.");
      return;
    }

    if (selectedStage.week === 4 && !localStorage.getItem(MOVEMENT_CATEGORY_CHALLENGE_KEY)) {
      window.location.href = "/extrato?challenge=week-4";
      return;
    }

    const todayKey = getLocalDateKey(new Date());
    setProgress((current) => {
      if (!current || current.completedWeeks.includes(selectedWeek)) return current;

      const completedWeeks = [...current.completedWeeks, selectedWeek].sort((first, second) => first - second);
      const nextPercent = Math.round((completedWeeks.length / journeyStages.length) * 100);
      const historyEntries = [{
        id: `week-${selectedWeek}-${todayKey}`,
        title: `Semana ${selectedWeek} concluída`,
        detail: `${selectedStage.title} · +10 moedas`,
        date: todayKey,
      }];

      if ([25, 50, 75, 100].includes(nextPercent)) {
        historyEntries.push({
          id: `milestone-${nextPercent}-${todayKey}`,
          title: `Marco de ${nextPercent}% alcançado`,
          detail: "Conquista pronta para compartilhar",
          date: todayKey,
        });
      }

      return {
        ...current,
        completedWeeks,
        history: [...current.history, ...historyEntries],
      };
    });
    setAnswerFeedback("");
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="Voltar ao painel IA.I Finanças">
          <span className={styles.brandMark}>IA</span>
          <span className={styles.brandCopy}><strong>IA.I</strong><small>FINANÇAS</small></span>
        </Link>
        <Link className={styles.backLink} href="/">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Voltar ao painel</span>
        </Link>
      </header>

      <div className={styles.content}>
        <section className={styles.intro} aria-labelledby="journey-heading">
          <div className={styles.introCopy}>
            <span className={styles.kicker}><Sparkles size={14} aria-hidden="true" /> UM PASSO DE CADA VEZ</span>
            <h1 id="journey-heading">90 dias para cuidar melhor do seu dinheiro.</h1>
            <p>Aprendizados rápidos e desafios possíveis, no seu ritmo. Se uma semana passar, você pode retomar de onde parou.</p>
          </div>
          <div className={styles.demoStamp}><span /> JORNADA DE DEMONSTRAÇÃO</div>
        </section>

        <section className={styles.progressSection} aria-label="Progresso geral">
          <div className={styles.progressHeader}>
            <div>
              <span className={styles.sectionEyebrow}>SUA CAMINHADA</span>
              <strong>Dia {day} <span>de {JOURNEY_LENGTH_DAYS}</span></strong>
            </div>
            <span className={styles.progressPercent}>{completionPercent}% <small>dos desafios</small></span>
          </div>
          <progress
            className={styles.progressTrack}
            aria-label="Etapas concluídas"
            value={completedCount}
            max={journeyStages.length}
          />
          <div className={styles.progressFoot}>
            <span><CheckCircle2 size={14} aria-hidden="true" /> Semana {unlockedWeeks} de {JOURNEY_LENGTH_WEEKS} · {completedCount} desafios concluídos</span>
            <span><Clock3 size={14} aria-hidden="true" /> {journeyStatus}</span>
          </div>
          <div className={styles.coinSummary}><Sparkles size={15} aria-hidden="true" /> {coins} moedas acumuladas <span>· o progresso mede desafios, não saúde financeira</span></div>
        </section>

        <section className={styles.journeyWorkspace} aria-label="Trilha educativa">
          <aside className={styles.timeline}>
            <div className={styles.timelineHeader}>
              <div>
                <span className={styles.sectionEyebrow}>A TRILHA</span>
                <h2>Seu caminho até a conquista</h2>
              </div>
              <span className={styles.openCount}>12 semanas</span>
            </div>
            <div className={styles.phaseList}>
              {journeyPhases.map((phase, index) => (
                <section className={styles.phaseGroup} key={phase.title} aria-label={`Etapa ${index + 1}: ${phase.title}`}>
                  <div className={styles.phaseHeading}>
                    <span>ETAPA {index + 1}</span>
                    <strong>{phase.title}</strong>
                  </div>
                  <ol className={styles.weekList}>
                    {journeyStages.filter((stage) => stage.week >= phase.startWeek && stage.week <= phase.endWeek).map((stage) => (
                      <li key={stage.week}>
                        <StageSelector
                          stage={stage}
                          isCurrent={selectedWeek === stage.week}
                          isUnlocked={stage.week <= unlockedWeeks}
                          isComplete={progress.completedWeeks.includes(stage.week)}
                          isOverdue={stage.week < unlockedWeeks}
                          onSelect={() => {
                            setSelectedWeek(stage.week);
                            setAnswerFeedback("");
                          }}
                        />
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
            <p className={styles.timelineNote}>Desafios anteriores continuam disponíveis. Os dias restantes até o 90º são para revisão e celebração.</p>
          </aside>

          <article className={styles.lesson} aria-labelledby="lesson-heading">
            <div className={styles.lessonTopline}>
              <span className={styles.lessonWeek}>SEMANA {String(selectedStage.week).padStart(2, "0")}</span>
              <span className={styles.lessonTime}><Clock3 size={13} aria-hidden="true" /> 5 min de leitura</span>
            </div>
            <h2 id="lesson-heading">{selectedStage.title}</h2>
            <p className={styles.lessonIntro}>{selectedStage.lesson}</p>

            <section className={styles.exampleBlock} aria-labelledby="example-title">
              <span className={styles.blockIcon}><Sparkles size={17} aria-hidden="true" /></span>
              <div>
                <h3 id="example-title">Na vida real</h3>
                <p>{selectedStage.example}</p>
              </div>
            </section>

            <section className={styles.challengeBlock} aria-labelledby="challenge-title">
              <div className={styles.challengeHeading}>
                <span className={styles.challengeIcon}><Target size={18} aria-hidden="true" /></span>
                <div>
                  <span className={styles.sectionEyebrow}>SEU DESAFIO</span>
                  <h3 id="challenge-title">{selectedStage.challengeTitle}</h3>
                </div>
              </div>
              <p>{selectedStage.challenge}</p>
              <JourneyDataPreview />
              {selectedStageComplete ? (
                <>
                  <fieldset className={styles.quizOptions} disabled>
                    <legend>{selectedStage.question}</legend>
                    {selectedStage.choices.map((choice, index) => (
                      <label key={choice}>
                        <input type="radio" name={`journey-week-${selectedWeek}`} checked={progress.selectedAnswers[String(selectedWeek)] === index} readOnly />
                        <span>{choice}</span>
                      </label>
                    ))}
                  </fieldset>
                  <output className={styles.completedFeedback} aria-live="polite">
                    <CheckCircle2 size={19} aria-hidden="true" />
                    <span><strong>{selectedStage.week === 3 ? "Resposta correta!" : "Etapa concluída."}</strong> {selectedStage.feedback}{selectedStage.nextStep && <small>{selectedStage.nextStep}</small>}</span>
                  </output>
                </>
              ) : (
                <>
                  <fieldset className={styles.quizOptions}>
                    <legend>{selectedStage.question}</legend>
                    {selectedStage.choices.map((choice, index) => (
                      <label key={choice}>
                        <input
                          type="radio"
                          name={`journey-week-${selectedWeek}`}
                          value={index}
                          checked={selectedAnswer === index}
                          onChange={() => saveSelectedAnswer(index)}
                        />
                        <span>{choice}</span>
                      </label>
                    ))}
                  </fieldset>
                  {answerFeedback && <output className={styles.answerFeedback} aria-live="polite">{answerFeedback}</output>}
                  <button className={styles.completeButton} type="button" onClick={submitSelectedStage} disabled={selectedAnswer === undefined}>
                    Responder desafio <Check size={17} aria-hidden="true" />
                  </button>
                </>
              )}
            </section>

            <div className={styles.lessonFooter}>
              <span><CalendarDays size={15} aria-hidden="true" /> {getStageDayRange(selectedStage.week)} da jornada</span>
              {selectedWeek < unlockedWeeks && !selectedStageComplete && <span className={styles.catchUpLabel}>Você pode concluir esta etapa atrasada</span>}
            </div>
          </article>
        </section>

        <section className={`${styles.rewardSection} ${rewardReady ? styles.rewardReady : ""}`} aria-labelledby="reward-heading">
          <span className={styles.rewardIcon}><Gift size={20} aria-hidden="true" /></span>
          <div className={styles.rewardCopy}>
            <span className={styles.sectionEyebrow}>NO FIM DA JORNADA</span>
            <h2 id="reward-heading">Uma conquista no seu ritmo.</h2>
            <p>{rewardMessage}</p>
          </div>
          <span className={styles.rewardStatus}>{rewardReady ? <><Trophy size={15} aria-hidden="true" /> Concluída</> : <><LockKeyhole size={14} aria-hidden="true" /> Simulada</>}</span>
        </section>

        <footer className={styles.footerNote}>
          <span>Protótipo educativo · nenhum dado bancário é acessado · nenhuma recompensa real é concedida</span>
          <Link href="/">Voltar ao painel <ArrowRight size={13} aria-hidden="true" /></Link>
        </footer>
      </div>
    </main>
  );
}