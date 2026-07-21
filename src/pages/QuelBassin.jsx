import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap.js";
import { useLangue } from "../i18n/index.jsx";
import { entreprise } from "../config/entreprise.js";
import "./quel-bassin.css";

/* ── Icônes de carte (traits fins, currentColor) ── */
const S = { viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
const ICONS = {
  // usage
  detente: <svg {...S}><path d="M4 21c2.4 0 2.4-2 4.8-2s2.4 2 4.8 2 2.4-2 4.8-2 2.4 2 4.8 2" /><circle cx="22" cy="9" r="3.2" /><path d="M9 14a5 5 0 0 1 9 0" /></svg>,
  sport: <svg {...S}><circle cx="21" cy="8" r="2.4" /><path d="M4 20c2.2 0 2.2-1.6 4.4-1.6S10.6 20 12.8 20s2.2-1.6 4.4-1.6S19.4 20 21.6 20s2.2-1.6 4.4-1.6" /><path d="M7 15l5-2 4 2 4-3" /></svg>,
  recevoir: <svg {...S}><path d="M9 6h9l-2 7h-5z" /><path d="M13.5 13v7" /><path d="M10 20h7" /><path d="M22 7c2 0 3 1 3 2.5S24 12 22 12" /></svg>,
  vue: <svg {...S}><path d="M4 22h24" /><path d="M4 22l8-10 5 5 3-4 8 9" /><circle cx="23" cy="8" r="2.6" /></svg>,
  // terrain
  plat: <svg {...S}><path d="M4 19h24" /><path d="M7 19v-3M13 19v-4M19 19v-3M25 19v-4" /></svg>,
  pente: <svg {...S}><path d="M4 23h7v-5h7v-5h7" /><path d="M4 23l7-5 7-5 7-5" opacity="0" /></svg>,
  petit: <svg {...S}><rect x="11" y="11" width="10" height="10" rx="1.5" /><path d="M5 5h3M24 5h3M5 27h3M24 27h3M5 5v3M27 5v3M5 24v3M27 24v3" /></svg>,
  vuevalu: <svg {...S}><rect x="5" y="7" width="22" height="16" rx="2" /><path d="M5 19l6-5 4 3 4-4 8 7" /><circle cx="21" cy="12" r="1.8" /></svg>,
  // espace
  petit30: <svg {...S}><rect x="12" y="12" width="8" height="8" rx="1.5" /><path d="M6 20V6h14" /></svg>,
  moyen: <svg {...S}><rect x="9" y="9" width="14" height="14" rx="1.5" /></svg>,
  grand: <svg {...S}><rect x="6" y="6" width="20" height="20" rx="2" /><path d="M11 16h10M16 11v10" opacity="0" /></svg>,
  inconnu: <svg {...S}><circle cx="16" cy="16" r="11" /><path d="M12.5 12.5a3.5 3.5 0 1 1 5 3.2c-1 .6-1.5 1.1-1.5 2.3" /><circle cx="16" cy="22" r="0.6" /></svg>,
  // priorite
  esthetique: <svg {...S}><path d="M16 5l2.4 6.6L25 14l-6.6 2.4L16 23l-2.4-6.6L7 14l6.6-2.4z" /></svg>,
  entretien: <svg {...S}><path d="M16 5s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z" /><path d="M13 17a3 3 0 0 0 3 3" /></svg>,
  budget: <svg {...S}><rect x="5" y="9" width="22" height="14" rx="2.5" /><circle cx="16" cy="16" r="3" /><path d="M5 13h3M24 19h3" /></svg>,
  durabilite: <svg {...S}><path d="M16 4l10 4v6c0 7-4.5 11-10 14C10.5 25 6 21 6 14V8z" /><path d="M12 15l3 3 5-6" /></svg>,
  // delai
  asap: <svg {...S}><path d="M17 4L7 18h7l-2 10 12-15h-8z" /></svg>,
  mois: <svg {...S}><rect x="5" y="7" width="22" height="20" rx="2.5" /><path d="M5 12h22M11 4v5M21 4v5" /><path d="M10 17h3M15 17h3M20 17h2M10 21h3M15 21h3" /></svg>,
  saison: <svg {...S}><circle cx="16" cy="16" r="5" /><path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.5 6.5l2 2M23.5 6.5l-2 2M6.5 25.5l2-2M23.5 25.5l-2-2" /></svg>,
  renseigne: <svg {...S}><circle cx="14" cy="14" r="8" /><path d="M20 20l6 6" /></svg>,
  // envies
  eclairage: <svg {...S}><path d="M16 4a8 8 0 0 0-5 14c1 .8 1.5 1.5 1.5 3h7c0-1.5.5-2.2 1.5-3a8 8 0 0 0-5-14z" /><path d="M13 27h6" /></svg>,
  spa: <svg {...S}><path d="M10 20c-2-2-2-5 0-7M16 20c-2-2-2-5 0-7M22 20c-2-2-2-5 0-7" /><path d="M5 24c2.4 0 2.4-1.6 4.8-1.6S12.2 24 14.6 24 17 22.4 19.4 22.4 21.8 24 24.2 24" /></svg>,
  volet: <svg {...S}><rect x="6" y="6" width="20" height="18" rx="2" /><path d="M6 11h20M6 15h20M6 19h20" /></svg>,
  chauffage: <svg {...S}><path d="M17 6a3 3 0 0 0-6 0v11a5 5 0 1 0 6 0z" /><path d="M14 20a1.6 1.6 0 1 0 0 .01" /><path d="M14 9v8" /><path d="M22 7c1.5 1 1.5 2.5 0 3.5M25 6c2 1.5 2 4 0 5.5" /></svg>,
  nage: <svg {...S}><path d="M6 12h14l-3-3M6 12l3 3" /><path d="M26 20H12l3 3M26 20l-3-3" /></svg>,
};

export default function QuelBassin() {
  const { t } = useLangue();
  const questions = entreprise.quiz.questions;
  const total = questions.length;

  const [view, setView] = useState("intro"); // "intro" | "quiz" | "recap"
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { usage:"detente", envies:["spa",...] }
  const [reduce, setReduce] = useState(false);

  const wipeRef = useRef(null);
  const contentRef = useRef(null);
  const beatRef = useRef(null);
  const busyRef = useRef(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return () => clearTimeout(beatRef.current);
  }, []);

  // Transition « vague » : un voile turquoise balaie, on échange au milieu.
  const transition = (mutate) => {
    if (busyRef.current) return;
    if (reduce) {
      mutate();
      gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      return;
    }
    busyRef.current = true;
    const w = wipeRef.current;
    gsap.timeline({ onComplete: () => { busyRef.current = false; } })
      .set(w, { display: "block", yPercent: 100 })
      .to(w, { yPercent: 0, duration: 0.3, ease: "power3.in" })
      .add(() => {
        mutate();
        gsap.fromTo(contentRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.05 });
      })
      .to(w, { yPercent: -100, duration: 0.42, ease: "power3.out" }, ">-0.02")
      .set(w, { display: "none" });
  };

  const q = questions[qIndex];

  const goNext = () => {
    clearTimeout(beatRef.current);
    if (qIndex < total - 1) transition(() => setQIndex((i) => i + 1));
    else transition(() => setView("recap"));
  };
  const goPrev = () => {
    clearTimeout(beatRef.current);
    if (qIndex > 0) transition(() => setQIndex((i) => i - 1));
    else transition(() => setView("intro"));
  };
  const start = () => transition(() => { setView("quiz"); setQIndex(0); });
  const restart = () => { setAnswers({}); transition(() => { setView("intro"); setQIndex(0); }); };

  const selectSingle = (qid, optId) => {
    setAnswers((a) => ({ ...a, [qid]: optId }));
    clearTimeout(beatRef.current);
    beatRef.current = setTimeout(goNext, 380); // le « beat » avant l'enchaînement
  };
  const toggleMulti = (qid, optId) => {
    setAnswers((a) => {
      const cur = new Set(a[qid] || []);
      cur.has(optId) ? cur.delete(optId) : cur.add(optId);
      return { ...a, [qid]: [...cur] };
    });
  };

  const isAnswered = (qid, multi) => (multi ? (answers[qid] || []).length > 0 : !!answers[qid]);
  const progress = (qIndex + (isAnswered(q?.id, q?.multi) ? 1 : 0)) / total;

  return (
    <section className="qz" id="quel-bassin">
      {/* Voile de transition */}
      <span className="qz__wipe" ref={wipeRef} aria-hidden="true" />

      {/* Jauge « niveau d'eau » (pendant le quiz) */}
      {view === "quiz" && (
        <div className="qz__gauge" aria-hidden="true">
          <div className="qz__gauge-tube">
            <div className="qz__gauge-fill" style={{ "--p": `${Math.max(6, progress * 100)}%` }}>
              <span className="qz__gauge-wave" />
            </div>
          </div>
          <span className="qz__gauge-label">{qIndex + 1}<i>/{total}</i></span>
        </div>
      )}

      <div className="qz__stage" ref={contentRef}>
        {/* ── INTRO ── */}
        {view === "intro" && (
          <div className="qz__intro">
            <p className="qz__eyebrow">{t("quizPage.eyebrow")}</p>
            <h1 className="qz__intro-titre">{t("quizPage.titre")}</h1>
            <p className="qz__intro-sous">{t("quizPage.sousTitre")}</p>
            <button className="qz__start" onClick={start}>
              <span>{t("quizPage.commencer")}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="qz__duree">{t("quizPage.dureeIndice")}</span>
          </div>
        )}

        {/* ── QUESTION ── */}
        {view === "quiz" && q && (
          <div className="qz__q">
            <div className="qz__q-head">
              <button className="qz__back" onClick={goPrev}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t("quizPage.retour")}
              </button>
              <span className="qz__step">{t("quizPage.question")} {qIndex + 1} {t("quizPage.sur")} {total}</span>
            </div>

            <h2 className="qz__q-titre">{t(`quizPage.questions.${q.id}.titre`)}</h2>
            {q.multi && <p className="qz__multi-hint">{t("quizPage.multiIndice")}</p>}

            <ul className={`qz__cards ${q.multi ? "qz__cards--multi" : ""}`} role="list">
              {q.options.map((optId) => {
                const selected = q.multi ? (answers[q.id] || []).includes(optId) : answers[q.id] === optId;
                return (
                  <li key={optId}>
                    <button
                      className={`qz__card ${selected ? "is-selected" : ""}`}
                      onClick={() => (q.multi ? toggleMulti(q.id, optId) : selectSingle(q.id, optId))}
                      aria-pressed={selected}
                    >
                      <span className="qz__card-icon">{ICONS[optId]}</span>
                      <span className="qz__card-label">{t(`quizPage.questions.${q.id}.options.${optId}.label`)}</span>
                      <span className="qz__card-detail">{t(`quizPage.questions.${q.id}.options.${optId}.detail`)}</span>
                      <span className="qz__card-check" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="qz__q-foot">
              {q.multi && (
                <button className="qz__skip" onClick={goNext}>{t("quizPage.passer")}</button>
              )}
              <button
                className="qz__next btn btn--solid"
                onClick={goNext}
                disabled={!isAnswered(q.id, q.multi)}
              >
                {t("quizPage.suivant")}
              </button>
            </div>
          </div>
        )}

        {/* ── RÉCAP (provisoire — le résultat cinématique arrive en Phase 3) ── */}
        {view === "recap" && (
          <div className="qz__recap">
            <p className="qz__eyebrow">{t("quizPage.eyebrow")}</p>
            <h2 className="qz__recap-titre">{t("quizPage.recapTitre")}</h2>
            <p className="qz__recap-sous">{t("quizPage.recapSousTitre")}</p>
            <div className="qz__recap-list">
              <h3>{t("quizPage.recapRappel")}</h3>
              <dl>
                {questions.map((qq) => {
                  const val = answers[qq.id];
                  if (!val || (Array.isArray(val) && !val.length)) return null;
                  const labels = (Array.isArray(val) ? val : [val]).map((v) => t(`quizPage.questions.${qq.id}.options.${v}.label`)).join(", ");
                  return (
                    <div key={qq.id}>
                      <dt>{t(`quizPage.questions.${qq.id}.titre`)}</dt>
                      <dd>{labels}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
            <button className="qz__restart" onClick={restart}>{t("quizPage.refaire")}</button>
          </div>
        )}
      </div>
    </section>
  );
}
