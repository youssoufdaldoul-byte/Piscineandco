import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap.js";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import { resolveMedia } from "../../config/mediaRemote.js";
import TransitionLink from "../../router/TransitionLink.jsx";
import "./Hero.css";

/**
 * HERO — SÉQUENCE DE CONSTRUCTION (time-lapse à cadrage fixe)
 * ---------------------------------------------------------------------------
 * Le cadrage ne bouge JAMAIS : même jardin, même angle du début à la fin.
 * Seul le contenu de la scène évolue (jardin vide → équipe → terrassement →
 * structure → mise en eau), par fondus enchaînés pilotés au scroll.
 * Une seule timeline maître (scrub) épingle la scène ; Lenis lisse le défilé.
 */
export default function Hero() {
  const { t } = useLangue();
  const stages = entreprise.heroConstruction; // 5 étapes (config)
  const etapes = t("hero.etapes") || []; // textes (i18n)

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const layerRefs = useRef([]);
  const capRefs = useRef([]);
  const introRef = useRef(null);
  const scrollRef = useRef(null);
  const dustRef = useRef(null);
  const ctaRef = useRef(null);
  const waterRef = useRef(null);

  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(rm);

    const ctx = gsap.context(() => {
      const layers = layerRefs.current.filter(Boolean);
      const caps = capRefs.current.filter(Boolean);

      // Apparition initiale de l'accroche + première légende
      gsap.set(introRef.current, { opacity: 0, y: 30 });
      gsap.to(introRef.current, { opacity: 1, y: 0, duration: 1.3, ease: "power3.out", delay: 0.3 });
      gsap.fromTo(
        caps[0],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.3, ease: "power3.out", delay: 0.55 }
      );

      if (rm) return; // reduced-motion : image finale figée, pas de séquence

      // États de départ
      gsap.set(layers, { opacity: 0 });
      gsap.set(layers[0], { opacity: 1 });
      gsap.set(caps.slice(1), { opacity: 0, y: 24 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20, pointerEvents: "none" });
      // Étape finale (mise en eau) : révélée du bas vers le haut (l'eau monte)
      gsap.set(waterRef.current, { opacity: 1, clipPath: "inset(100% 0 0 0)" });
      gsap.set(dustRef.current, { opacity: 0 });

      // ─── TIMELINE MAÎTRE (scrubbée) ───────────────────────────────────────
      // Bornes des étapes : S1 0-15%, S2 15-35%, S3 35-55%, S4 55-75%, S5 75-100%
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: stageRef.current,
          pinSpacing: true,
        },
      });

      // Accroche + indicateur de défilement : s'effacent dès qu'on entre dans la séquence
      tl.to(introRef.current, { opacity: 0, y: -24, duration: 0.1 }, 0.05)
        .to(scrollRef.current, { opacity: 0, duration: 0.06 }, 0.04);

      // ── Fondus enchaînés image → image (crossfades ~6%) ──
      // L1 → L2
      tl.to(layers[0], { opacity: 0, duration: 0.06 }, 0.13)
        .to(layers[1], { opacity: 1, duration: 0.06 }, 0.13)
        // L2 → L3
        .to(layers[1], { opacity: 0, duration: 0.06 }, 0.33)
        .to(layers[2], { opacity: 1, duration: 0.06 }, 0.33)
        // L3 → L4
        .to(layers[2], { opacity: 0, duration: 0.06 }, 0.53)
        .to(layers[3], { opacity: 1, duration: 0.06 }, 0.53);

      // ── Poussière du terrassement (étape 3) ──
      tl.to(dustRef.current, { opacity: 1, duration: 0.06 }, 0.35)
        .to(dustRef.current, { opacity: 0, duration: 0.08 }, 0.55);

      // ── Étape 5 — mise en eau : la surface finie monte du bas (l'eau se remplit) ──
      // L4 (structure) reste dessous ; L5 (piscine remplie) se dévoile bas → haut.
      tl.to(waterRef.current, { clipPath: "inset(0% 0 0 0)", ease: "power1.inOut", duration: 0.22 }, 0.76);

      // ── Légendes : chaque texte entre puis sort autour de sa fenêtre d'étape ──
      const windows = [
        [0.0, 0.13],
        [0.15, 0.33],
        [0.35, 0.53],
        [0.55, 0.74],
        [0.78, 1.0],
      ];
      caps.forEach((cap, i) => {
        if (!cap) return;
        const [inAt, outAt] = windows[i];
        if (i > 0) tl.to(cap, { opacity: 1, y: 0, duration: 0.05 }, inAt);
        // sortie (sauf dernière légende, qui reste jusqu'au bout)
        if (i < caps.length - 1) tl.to(cap, { opacity: 0, y: -20, duration: 0.05 }, outAt);
      });

      // ── CTA final : apparaît sur la mise en eau ──
      tl.to(ctaRef.current, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.06 }, 0.9);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={`hero ${reduce ? "hero--static" : ""}`} ref={rootRef} id="accueil">
      <div className="hero__stage" ref={stageRef}>
        {/* ── Empilement des scènes (même cadrage) ── */}
        <div className="hero__frame">
          {stages.map((s, i) => {
            const isWater = i === stages.length - 1;
            return (
              <div
                key={s.id}
                className={`hero__layer ${isWater ? "hero__layer--water" : ""}`}
                ref={(el) => {
                  layerRefs.current[i] = el;
                  if (isWater) waterRef.current = el;
                }}
                style={{ backgroundImage: `url(${resolveMedia(s.image)})` }}
                aria-hidden="true"
              />
            );
          })}
          {/* Poussière du terrassement */}
          <div className="hero__dust" ref={dustRef} aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} style={{ "--i": i }} />
            ))}
          </div>
          {/* Voile de lisibilité */}
          <div className="hero__scrim" aria-hidden="true" />
        </div>

        {/* ── Accroche de départ ── */}
        <div className="hero__intro" ref={introRef}>
          <p className="hero__eyebrow">{entreprise.nom}</p>
          <h1 className="hero__title">{t("hero.titre")}</h1>
        </div>

        {/* ── Légendes narratives (une par étape) ── */}
        <div className="hero__captions">
          {stages.map((s, i) => (
            <figure
              key={s.id}
              className="hero__caption"
              ref={(el) => (capRefs.current[i] = el)}
            >
              <figcaption>
                <span className="hero__caption-num">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="hero__caption-titre">{etapes[i]?.titre}</h2>
                <p className="hero__caption-sous">{etapes[i]?.sous}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* ── CTA final (mise en eau) ── */}
        <div className="hero__cta-wrap" ref={ctaRef}>
          <TransitionLink to="/rendez-vous" className="hero__cta">
            <span>{t("hero.cta")}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TransitionLink>
        </div>

        {/* ── Indicateur de défilement ── */}
        <div className="hero__scroll" ref={scrollRef} aria-hidden="true">
          <span className="hero__scroll-label">{t("hero.scroll")}</span>
          <span className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
}
