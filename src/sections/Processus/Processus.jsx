import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap.js";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import Reveal from "../../components/Reveal/Reveal.jsx";
import "./Processus.css";

// Icônes par étape
const ICONS = {
  rencontre: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  conception: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12l8.73-5.04M12 22V12" />
    </svg>
  ),
  construction: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  livraison: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </svg>
  ),
};

export default function Processus() {
  const { t } = useLangue();
  const rootRef = useRef(null);
  const fillRef = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      if (fillRef.current) fillRef.current.style.transform = "none";
      return;
    }
    const vertical = window.matchMedia("(max-width: 760px)").matches;
    const axis = vertical ? "scaleY" : "scaleX";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fillRef.current,
        { [axis]: 0 },
        {
          [axis]: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".proc__timeline",
            start: "top 70%",
            end: "bottom 75%",
            scrub: true,
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section proc" id="processus" ref={rootRef}>
      <div className="container">
        <header className="proc__head">
          <Reveal as="p" className="eyebrow">
            {t("processus.eyebrow")}
          </Reveal>
          <Reveal as="h2" className="proc__title" delay={0.05}>
            {t("processus.titre")}
          </Reveal>
          <Reveal as="p" className="proc__intro" delay={0.1}>
            {t("processus.intro")}
          </Reveal>
        </header>

        <div className="proc__timeline">
          <div className="proc__line" aria-hidden="true">
            <span className="proc__line-fill" ref={fillRef} />
          </div>

          <ol className="proc__steps">
            {entreprise.processus.map((etape, i) => (
              <Reveal as="li" className="proc-step" key={etape.id} delay={i * 0.08}>
                <span className="proc-step__dot" aria-hidden="true">
                  <span className="proc-step__icon">{ICONS[etape.id]}</span>
                </span>
                <span className="proc-step__num">{etape.numero}</span>
                <h3 className="proc-step__title">
                  {t(`processus.etapes.${etape.id}.titre`)}
                </h3>
                <p className="proc-step__text">
                  {t(`processus.etapes.${etape.id}.texte`)}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
