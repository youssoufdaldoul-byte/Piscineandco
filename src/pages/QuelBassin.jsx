import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap.js";
import { useLangue } from "../i18n/index.jsx";
import { entreprise } from "../config/entreprise.js";
import { resolveMedia } from "../config/mediaRemote.js";
import { recommander } from "../lib/quizScore.js";
import TransitionLink from "../router/TransitionLink.jsx";
import "./quel-bassin.css";

/* ── Icônes de carte (traits fins, currentColor) ── */
const S = { viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
const ICONS = {
  detente: <svg {...S}><path d="M4 21c2.4 0 2.4-2 4.8-2s2.4 2 4.8 2 2.4-2 4.8-2 2.4 2 4.8 2" /><circle cx="22" cy="9" r="3.2" /><path d="M9 14a5 5 0 0 1 9 0" /></svg>,
  sport: <svg {...S}><circle cx="21" cy="8" r="2.4" /><path d="M4 20c2.2 0 2.2-1.6 4.4-1.6S10.6 20 12.8 20s2.2-1.6 4.4-1.6S19.4 20 21.6 20s2.2-1.6 4.4-1.6" /><path d="M7 15l5-2 4 2 4-3" /></svg>,
  recevoir: <svg {...S}><path d="M9 6h9l-2 7h-5z" /><path d="M13.5 13v7" /><path d="M10 20h7" /><path d="M22 7c2 0 3 1 3 2.5S24 12 22 12" /></svg>,
  vue: <svg {...S}><path d="M4 22h24" /><path d="M4 22l8-10 5 5 3-4 8 9" /><circle cx="23" cy="8" r="2.6" /></svg>,
  plat: <svg {...S}><path d="M4 19h24" /><path d="M7 19v-3M13 19v-4M19 19v-3M25 19v-4" /></svg>,
  pente: <svg {...S}><path d="M4 23h7v-5h7v-5h7" /></svg>,
  petit: <svg {...S}><rect x="11" y="11" width="10" height="10" rx="1.5" /><path d="M5 5h3M24 5h3M5 27h3M24 27h3M5 5v3M27 5v3M5 24v3M27 24v3" /></svg>,
  vuevalu: <svg {...S}><rect x="5" y="7" width="22" height="16" rx="2" /><path d="M5 19l6-5 4 3 4-4 8 7" /><circle cx="21" cy="12" r="1.8" /></svg>,
  petit30: <svg {...S}><rect x="12" y="12" width="8" height="8" rx="1.5" /><path d="M6 20V6h14" /></svg>,
  moyen: <svg {...S}><rect x="9" y="9" width="14" height="14" rx="1.5" /></svg>,
  grand: <svg {...S}><rect x="6" y="6" width="20" height="20" rx="2" /></svg>,
  inconnu: <svg {...S}><circle cx="16" cy="16" r="11" /><path d="M12.5 12.5a3.5 3.5 0 1 1 5 3.2c-1 .6-1.5 1.1-1.5 2.3" /><circle cx="16" cy="22" r="0.6" /></svg>,
  esthetique: <svg {...S}><path d="M16 5l2.4 6.6L25 14l-6.6 2.4L16 23l-2.4-6.6L7 14l6.6-2.4z" /></svg>,
  entretien: <svg {...S}><path d="M16 5s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z" /><path d="M13 17a3 3 0 0 0 3 3" /></svg>,
  budget: <svg {...S}><rect x="5" y="9" width="22" height="14" rx="2.5" /><circle cx="16" cy="16" r="3" /><path d="M5 13h3M24 19h3" /></svg>,
  durabilite: <svg {...S}><path d="M16 4l10 4v6c0 7-4.5 11-10 14C10.5 25 6 21 6 14V8z" /><path d="M12 15l3 3 5-6" /></svg>,
  asap: <svg {...S}><path d="M17 4L7 18h7l-2 10 12-15h-8z" /></svg>,
  mois: <svg {...S}><rect x="5" y="7" width="22" height="20" rx="2.5" /><path d="M5 12h22M11 4v5M21 4v5" /><path d="M10 17h3M15 17h3M20 17h2M10 21h3M15 21h3" /></svg>,
  saison: <svg {...S}><circle cx="16" cy="16" r="5" /><path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.5 6.5l2 2M23.5 6.5l-2 2M6.5 25.5l2-2M23.5 25.5l-2-2" /></svg>,
  renseigne: <svg {...S}><circle cx="14" cy="14" r="8" /><path d="M20 20l6 6" /></svg>,
  eclairage: <svg {...S}><path d="M16 4a8 8 0 0 0-5 14c1 .8 1.5 1.5 1.5 3h7c0-1.5.5-2.2 1.5-3a8 8 0 0 0-5-14z" /><path d="M13 27h6" /></svg>,
  spa: <svg {...S}><path d="M10 20c-2-2-2-5 0-7M16 20c-2-2-2-5 0-7M22 20c-2-2-2-5 0-7" /><path d="M5 24c2.4 0 2.4-1.6 4.8-1.6S12.2 24 14.6 24 17 22.4 19.4 22.4 21.8 24 24.2 24" /></svg>,
  volet: <svg {...S}><rect x="6" y="6" width="20" height="18" rx="2" /><path d="M6 11h20M6 15h20M6 19h20" /></svg>,
  chauffage: <svg {...S}><path d="M17 6a3 3 0 0 0-6 0v11a5 5 0 1 0 6 0z" /><path d="M14 9v8" /><path d="M22 7c1.5 1 1.5 2.5 0 3.5M25 6c2 1.5 2 4 0 5.5" /></svg>,
  nage: <svg {...S}><path d="M6 12h14l-3-3M6 12l3 3" /><path d="M26 20H12l3 3M26 20l-3-3" /></svg>,
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function QuelBassin() {
  const { t } = useLangue();
  const quiz = entreprise.quiz;
  const questions = quiz.questions;
  const total = questions.length;

  const [view, setView] = useState("intro"); // intro | quiz | reveal | result
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reco, setReco] = useState(null);
  const [override, setOverride] = useState(null); // permet d'afficher l'alternative
  const [reduce, setReduce] = useState(false);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState(""); // "" | "err" | "sending" | "sent"
  const [copied, setCopied] = useState(false);

  const wipeRef = useRef(null);
  const contentRef = useRef(null);
  const revealRef = useRef(null);
  const beatRef = useRef(null);
  const busyRef = useRef(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // Préchargement des visuels de résultat pendant que le visiteur répond
    Object.values(quiz.bassinsInfo || {}).forEach((info) => {
      if (info.awaiting) return;
      (info.photos || [info.image]).forEach((src) => { const im = new Image(); im.src = resolveMedia(src); });
    });
    return () => clearTimeout(beatRef.current);
  }, []);

  const transition = (mutate) => {
    if (busyRef.current) return;
    if (reduce) { mutate(); gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 }); return; }
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
    else {
      setReco(recommander(answers, quiz));
      setOverride(null);
      transition(() => setView("reveal"));
    }
  };
  const goPrev = () => {
    clearTimeout(beatRef.current);
    if (qIndex > 0) transition(() => setQIndex((i) => i - 1));
    else transition(() => setView("intro"));
  };
  const start = () => transition(() => { setView("quiz"); setQIndex(0); });
  const restart = () => { setAnswers({}); setReco(null); setOverride(null); setEmail(""); setEmailState(""); transition(() => { setView("intro"); setQIndex(0); }); };

  const selectSingle = (qid, optId) => {
    setAnswers((a) => ({ ...a, [qid]: optId }));
    clearTimeout(beatRef.current);
    beatRef.current = setTimeout(goNext, 380);
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

  // ── Animation de révélation (2–2,5 s) → puis résultat ──
  useEffect(() => {
    if (view !== "reveal") return;
    const el = revealRef.current;
    const dur = reduce ? 0.5 : 2.2;
    const tl = gsap.timeline({ onComplete: () => setView("result") });
    if (!reduce && el) {
      const rings = el.querySelectorAll(".qz-reveal__ring");
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(rings, { scale: 0, opacity: 0.7 }, { scale: 1, opacity: 0, duration: 1.6, ease: "power2.out", stagger: 0.25 }, 0.1)
        .to(el, { opacity: 0, duration: 0.4 }, dur - 0.4);
    } else {
      tl.to({}, { duration: dur });
    }
    return () => tl.kill();
  }, [view, reduce]);

  // ── Données du résultat ──
  const winner = override || reco?.winner;
  const alt = winner && reco ? (winner === reco.winner ? reco.runnerUp : reco.winner) : null;
  const info = winner ? quiz.bassinsInfo[winner] : null;

  const buildJustif = () => {
    let tpl = t(`quizPage.justif.${winner}`) || "";
    const usage = t(`quizPage.phrases.usage.${answers.usage}`) || "";
    const terrain = t(`quizPage.phrases.terrain.${answers.terrain}`) || "";
    return tpl.replace("{usage}", usage).replace("{terrain}", terrain);
  };

  const reponsesLisibles = () =>
    Object.fromEntries(
      questions.map((qq) => {
        const v = answers[qq.id];
        if (!v || (Array.isArray(v) && !v.length)) return [t(`quizPage.questions.${qq.id}.titre`), "—"];
        const labels = (Array.isArray(v) ? v : [v]).map((x) => t(`quizPage.questions.${qq.id}.options.${x}.label`)).join(", ");
        return [t(`quizPage.questions.${qq.id}.titre`), labels];
      })
    );

  const storeForQuote = () => {
    try {
      sessionStorage.setItem("azur_quiz", JSON.stringify({
        bassin: winner,
        bassinNom: t(`quizPage.bassins.${winner}.nom`),
        reponses: reponsesLisibles(),
      }));
    } catch (_) { /* stockage indisponible */ }
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) { setEmailState("err"); return; }
    setEmailState("sending");
    const endpoint = entreprise.formulaire?.endpoint || "";
    const body = { _sujet: "Résultat quiz — " + t(`quizPage.bassins.${winner}.nom`), email, bassin: winner, ...reponsesLisibles() };
    try {
      if (endpoint && !endpoint.includes("VOTRE_ID")) {
        await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
      }
      setEmailState("sent");
    } catch (_) { setEmailState("sent"); }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: entreprise.nom, text: t(`quizPage.bassins.${winner}.nom`), url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    } catch (_) { /* annulé */ }
  };

  return (
    <section className="qz" id="quel-bassin">
      <span className="qz__wipe" ref={wipeRef} aria-hidden="true" />

      {/* Révélation cinématique */}
      {view === "reveal" && (
        <div className="qz-reveal" ref={revealRef}>
          <span className="qz-reveal__ring" /><span className="qz-reveal__ring" /><span className="qz-reveal__ring" />
          <p className="qz-reveal__txt">{t("quizPage.revealTexte")}</p>
        </div>
      )}

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
                    <button className={`qz__card ${selected ? "is-selected" : ""}`} onClick={() => (q.multi ? toggleMulti(q.id, optId) : selectSingle(q.id, optId))} aria-pressed={selected}>
                      <span className="qz__card-icon">{ICONS[optId]}</span>
                      <span className="qz__card-label">{t(`quizPage.questions.${q.id}.options.${optId}.label`)}</span>
                      <span className="qz__card-detail">{t(`quizPage.questions.${q.id}.options.${optId}.detail`)}</span>
                      <span className="qz__card-check" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="qz__q-foot">
              {q.multi && <button className="qz__skip" onClick={goNext}>{t("quizPage.passer")}</button>}
              <button className="qz__next btn btn--solid" onClick={goNext} disabled={!isAnswered(q.id, q.multi)}>{t("quizPage.suivant")}</button>
            </div>
          </div>
        )}

        {/* ── RÉSULTAT ── */}
        {view === "result" && winner && info && (
          <div className="qz-res">
            <div className="qz-res__hero-wrap">
              {info.awaiting ? (
                <div className="qz-res__await">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true"><path d="M4 16l5-5 4 4 3-3 4 4M3 20h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.4" /></svg>
                  <span>{t("quizPage.awaitingVisuel")}</span>
                </div>
              ) : (
                <div className="qz-res__hero" style={{ backgroundImage: `url(${resolveMedia(info.image)})` }} />
              )}
              <div className="qz-res__hero-scrim" />
              <div className="qz-res__hero-txt">
                <p className="qz-res__label">{t("quizPage.votreBassin")}</p>
                <h1 className="qz-res__nom">{t(`quizPage.bassins.${winner}.nom`)}</h1>
              </div>
            </div>

            <p className="qz-res__justif">{buildJustif()}</p>

            <div className="qz-res__grid">
              <div className="qz-res__carac">
                <h3 className="qz-res__sub">{t("quizPage.caracTitre")}</h3>
                <dl>
                  <div><dt>{t("quizPage.budgetLabel")}</dt><dd>{info.budget}</dd></div>
                  <div><dt>{t("quizPage.entretienLabel")}</dt><dd>{t(`piscinesPage.entretien.${info.entretien}`)}</dd></div>
                  <div><dt>{t("quizPage.delaiLabel")}</dt><dd>{info.delai} {t("quizPage.delaiUnite")}</dd></div>
                </dl>
                <ul className="qz-res__forts">
                  {(t(`quizPage.forts.${winner}`) || []).map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>

              <div className="qz-res__photos">
                <h3 className="qz-res__sub">{t("quizPage.photosTitre")}</h3>
                <div className="qz-res__photos-grid">
                  {(info.photos || []).map((src, i) => (
                    info.awaiting
                      ? <div key={i} className="qz-res__photo qz-res__photo--await">{t("quizPage.awaitingVisuel")}</div>
                      : <div key={i} className="qz-res__photo" style={{ backgroundImage: `url(${resolveMedia(src)})` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Voir aussi (alternative) */}
            {alt && (
              <button className="qz-res__alt" onClick={() => { setOverride(alt); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }}>
                <span className="qz-res__alt-media">
                  {quiz.bassinsInfo[alt].awaiting
                    ? <span className="qz-res__alt-await" />
                    : <span style={{ backgroundImage: `url(${resolveMedia(quiz.bassinsInfo[alt].image)})` }} />}
                </span>
                <span className="qz-res__alt-txt">
                  <span className="qz-res__alt-label">{t("quizPage.voirAussi")}</span>
                  <span className="qz-res__alt-nom">{t(`quizPage.bassins.${alt}.nom`)}</span>
                </span>
              </button>
            )}

            {/* Actions */}
            <div className="qz-res__actions">
              <TransitionLink to={`/rendez-vous?bassin=${winner}`} className="btn btn--solid qz-res__cta" onNavigate={storeForQuote}>
                {t("quizPage.ctaDevis")}
              </TransitionLink>

              {emailState === "sent" ? (
                <p className="qz-res__email-merci">{t("quizPage.emailMerci")}</p>
              ) : (
                <form className={`qz-res__email ${emailState === "err" ? "has-error" : ""}`} onSubmit={submitEmail}>
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (emailState === "err") setEmailState(""); }} placeholder={t("quizPage.emailPlaceholder")} aria-label={t("quizPage.emailPlaceholder")} />
                  <button type="submit" className="btn btn--ghost" disabled={emailState === "sending"}>{t("quizPage.emailEnvoyer")}</button>
                </form>
              )}
              {emailState === "err" && <p className="qz-res__email-err">{t("quizPage.emailErreur")}</p>}

              <div className="qz-res__tertiary">
                <button onClick={restart} className="qz-res__link">{t("quizPage.refaire")}</button>
                <button onClick={share} className="qz-res__link">
                  {copied ? t("quizPage.partageCopie") : t("quizPage.partager")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
