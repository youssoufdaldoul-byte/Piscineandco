import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap.js";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import { resolveMedia } from "../../config/mediaRemote.js";
import TransitionLink from "../../router/TransitionLink.jsx";
import "./Hero.css";

/**
 * HERO — CHANTIER VIVANT (cadrage fixe, mais rien n'est jamais figé)
 * ---------------------------------------------------------------------------
 * On ne fait PAS de fondu entre images. Chaque changement d'étape est soit
 * un masque qui grandit, soit un élément qui se déplace, soit un niveau qui
 * monte — piloté au scroll sur une timeline maître unique (scrub).
 *   1. jardin vide  → ken-burns + pollen + parallaxe
 *   1→2 arrivée     → la pelleteuse / le camion / les ouvriers ENTRENT (PNG)
 *   2→3 terrassement→ masque ELLIPSE qui s'ouvre (le trou se creuse) + vidéo
 *   3→4 structure   → masque qui monte du bas (les murs sortent de terre)
 *   4→5 mise en eau → masque dont la HAUTEUR monte (l'eau remplit) + reflets
 * Les étapes se chevauchent (offsets négatifs) et un voile (poussière / halo)
 * culmine à chaque jointure pour masquer les raccords.
 */
export default function Hero() {
  const { t } = useLangue();
  const stages = entreprise.heroConstruction;
  const props = entreprise.heroProps;
  const etapes = t("hero.etapes") || [];
  const digVideo = stages[2]?.video;

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const emptyRef = useRef(null);
  const excavatorRef = useRef(null);
  const truckRef = useRef(null);
  const workersRef = useRef(null);
  const digRef = useRef(null);
  const structRef = useRef(null);
  const waterRef = useRef(null);
  const shimmerRef = useRef(null);
  const pollenRef = useRef(null);
  const dustRef = useRef(null);
  const sprayRef = useRef(null);
  const veilDustRef = useRef(null);
  const veilBloomRef = useRef(null);
  const introRef = useRef(null);
  const scrollRef = useRef(null);
  const ctaRef = useRef(null);
  const capRefs = useRef([]);

  const [reduce, setReduce] = useState(false);
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 761px)").matches;
    setReduce(rm);
    setUseVideo(desktop && !rm && !!digVideo);

    const ctx = gsap.context(() => {
      const caps = capRefs.current.filter(Boolean);

      // Intro + première légende
      gsap.set(introRef.current, { opacity: 0, y: 30 });
      gsap.to(introRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 });
      gsap.fromTo(caps[0], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.5 });

      if (rm) return; // reduced-motion : image finale figée

      // États initiaux
      gsap.set([excavatorRef.current, truckRef.current, workersRef.current], { opacity: 0 });
      gsap.set(excavatorRef.current, { xPercent: -65 });
      gsap.set(truckRef.current, { xPercent: 80 });
      gsap.set(workersRef.current, { xPercent: -35 });
      gsap.set(digRef.current, { "--dig": 0 });
      gsap.set(structRef.current, { "--rise": 0 });
      gsap.set(waterRef.current, { "--water": 0 });
      gsap.set([pollenRef.current, dustRef.current, sprayRef.current, veilDustRef.current, veilBloomRef.current], { opacity: 0 });
      gsap.set(shimmerRef.current, { top: "100%", opacity: 0 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20, pointerEvents: "none" });
      gsap.set(caps.slice(1), { opacity: 0, y: 24 });

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

      // ── Parallaxe continue (profondeur) : fond lent, éléments proches rapides ──
      tl.fromTo(emptyRef.current, { yPercent: 0 }, { yPercent: -5, duration: 1 }, 0)
        .fromTo([excavatorRef.current, truckRef.current, workersRef.current], { yPercent: 0 }, { yPercent: -10, duration: 1 }, 0);

      // ── Ken-burns par plaque (jamais figé) ──
      tl.fromTo(emptyRef.current, { scale: 1 }, { scale: 1.06, duration: 0.32 }, 0)
        .fromTo(digRef.current, { scale: 1.01 }, { scale: 1.06, duration: 0.3 }, 0.28)
        .fromTo(structRef.current, { scale: 1.01 }, { scale: 1.05, duration: 0.24 }, 0.5)
        .fromTo(waterRef.current, { scale: 1.02 }, { scale: 1.05, duration: 0.3 }, 0.7);

      // Accroche + scroll : s'effacent dès l'entrée
      tl.to(introRef.current, { opacity: 0, y: -24, duration: 0.09 }, 0.05)
        .to(scrollRef.current, { opacity: 0, duration: 0.06 }, 0.04);

      // Pollen (jardin vide)
      tl.to(pollenRef.current, { opacity: 1, duration: 0.05 }, 0.02)
        .to(pollenRef.current, { opacity: 0, duration: 0.06 }, 0.15);

      // ── ARRIVÉE : les engins ENTRENT dans le cadre ──
      tl.to(excavatorRef.current, { xPercent: 0, opacity: 1, ease: "back.out(1.25)", duration: 0.13 }, 0.10)
        .to(truckRef.current, { xPercent: 0, opacity: 1, ease: "power3.out", duration: 0.13 }, 0.14)
        .to(workersRef.current, { xPercent: 0, opacity: 1, ease: "power2.out", duration: 0.1 }, 0.20);
      // Voile de poussière au moment de l'arrivée
      tl.to(veilDustRef.current, { opacity: 0.4, duration: 0.05 }, 0.19)
        .to(veilDustRef.current, { opacity: 0, duration: 0.08 }, 0.27);

      // ── TERRASSEMENT : l'ellipse s'ouvre (chevauche la fin de l'arrivée) ──
      tl.to(digRef.current, { "--dig": 1, ease: "power1.inOut", duration: 0.2 }, 0.28);
      // Les PNG d'arrivée s'effacent quand le trou s'ouvre (la vidéo prend le relais)
      tl.to([excavatorRef.current, truckRef.current, workersRef.current], { opacity: 0, duration: 0.08 }, 0.30);
      // Poussière + terre qui tombe pendant le creusement
      tl.to(dustRef.current, { opacity: 1, duration: 0.05 }, 0.30)
        .to(veilDustRef.current, { opacity: 0.36, duration: 0.05 }, 0.33)
        .to(veilDustRef.current, { opacity: 0, duration: 0.1 }, 0.44)
        .to(dustRef.current, { opacity: 0, duration: 0.08 }, 0.52);

      // ── STRUCTURE : le masque monte du bas (chevauche la fin du terrassement) ──
      tl.to(structRef.current, { "--rise": 1, ease: "power1.inOut", duration: 0.18 }, 0.50);

      // ── MISE EN EAU : la hauteur d'eau monte (chevauche la fin de la structure) ──
      tl.to(waterRef.current, { "--water": 1, ease: "power1.inOut", duration: 0.2 }, 0.70);
      // Ligne de reflet qui remonte avec la surface
      tl.to(shimmerRef.current, { top: "12%", opacity: 1, ease: "power1.inOut", duration: 0.16 }, 0.70)
        .to(shimmerRef.current, { opacity: 0, duration: 0.08 }, 0.9);
      // Fines gouttelettes + halo chaud à la jointure 4→5
      tl.to(sprayRef.current, { opacity: 1, duration: 0.06 }, 0.72)
        .to(sprayRef.current, { opacity: 0, duration: 0.1 }, 0.95)
        .to(veilBloomRef.current, { opacity: 0.4, duration: 0.06 }, 0.74)
        .to(veilBloomRef.current, { opacity: 0, duration: 0.12 }, 0.86);

      // ── Légendes : entrée/sortie autour de chaque fenêtre d'étape ──
      const windows = [
        [0.0, 0.12],
        [0.14, 0.30],
        [0.32, 0.50],
        [0.52, 0.70],
        [0.74, 1.0],
      ];
      caps.forEach((cap, i) => {
        if (!cap) return;
        const [inAt, outAt] = windows[i];
        if (i > 0) tl.to(cap, { opacity: 1, y: 0, duration: 0.05 }, inAt);
        if (i < caps.length - 1) tl.to(cap, { opacity: 0, y: -20, duration: 0.05 }, outAt);
      });

      // CTA final
      tl.to(ctaRef.current, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.06 }, 0.9);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={`hero ${reduce ? "hero--static" : ""}`} ref={rootRef} id="accueil">
      <div className="hero__stage" ref={stageRef}>
        <div className="hero__scene">
          {/* Étape 1 — jardin vide (plaque de base) */}
          <div className="hero__plate hero__plate--empty" ref={emptyRef} aria-hidden="true">
            <div className="hero__plate-inner" style={{ backgroundImage: `url(${resolveMedia(stages[0].image)})` }} />
          </div>

          {/* Éléments qui ENTRENT (arrivée) — PNG détourés */}
          <div className="hero__prop hero__prop--excavator" ref={excavatorRef} style={{ backgroundImage: `url(${resolveMedia(props.excavator)})` }} aria-hidden="true" />
          <div className="hero__prop hero__prop--truck" ref={truckRef} style={{ backgroundImage: `url(${resolveMedia(props.truck)})` }} aria-hidden="true" />
          <div className="hero__prop hero__prop--workers" ref={workersRef} style={{ backgroundImage: `url(${resolveMedia(props.workers)})` }} aria-hidden="true" />

          {/* Étape 3 — terrassement (révélé par une ellipse) : vidéo desktop, image sinon */}
          <div className="hero__plate hero__plate--dig" ref={digRef} aria-hidden="true">
            <div className="hero__plate-inner" style={{ backgroundImage: `url(${resolveMedia(stages[2].image)})` }}>
              {useVideo && (
                <video
                  className="hero__dig-video"
                  src={resolveMedia(digVideo)}
                  poster={resolveMedia(stages[2].image)}
                  autoPlay muted loop playsInline preload="metadata"
                />
              )}
            </div>
          </div>

          {/* Étape 4 — structure (révélée du bas vers le haut) */}
          <div className="hero__plate hero__plate--structure" ref={structRef} aria-hidden="true">
            <div className="hero__plate-inner" style={{ backgroundImage: `url(${resolveMedia(stages[3].image)})` }} />
          </div>

          {/* Étape 5 — mise en eau (hauteur d'eau qui monte) */}
          <div className="hero__plate hero__plate--water" ref={waterRef} aria-hidden="true">
            <div className="hero__plate-inner" style={{ backgroundImage: `url(${resolveMedia(stages[4].image)})` }}>
              <div className="hero__caustic" />
            </div>
          </div>
          {/* Ligne de reflet de surface (monte avec l'eau) */}
          <div className="hero__shimmer" ref={shimmerRef} aria-hidden="true" />

          {/* Particules par étape */}
          <div className="hero__particles hero__particles--pollen" ref={pollenRef} aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => <span key={i} style={{ "--i": i }} />)}
          </div>
          <div className="hero__particles hero__particles--dust" ref={dustRef} aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => <span key={i} style={{ "--i": i }} />)}
          </div>
          <div className="hero__particles hero__particles--spray" ref={sprayRef} aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => <span key={i} style={{ "--i": i }} />)}
          </div>

          {/* Voiles atmosphériques (jointures) */}
          <div className="hero__veil hero__veil--dust" ref={veilDustRef} aria-hidden="true" />
          <div className="hero__veil hero__veil--bloom" ref={veilBloomRef} aria-hidden="true" />

          {/* Voile de lisibilité */}
          <div className="hero__scrim" aria-hidden="true" />
        </div>

        {/* Accroche de départ */}
        <div className="hero__intro" ref={introRef}>
          <p className="hero__eyebrow">{entreprise.nom}</p>
          <h1 className="hero__title">{t("hero.titre")}</h1>
        </div>

        {/* Légendes narratives */}
        <div className="hero__captions">
          {stages.map((s, i) => (
            <figure key={s.id} className="hero__caption" ref={(el) => (capRefs.current[i] = el)}>
              <figcaption>
                <span className="hero__caption-num">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="hero__caption-titre">{etapes[i]?.titre}</h2>
                <p className="hero__caption-sous">{etapes[i]?.sous}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* CTA final */}
        <div className="hero__cta-wrap" ref={ctaRef}>
          <TransitionLink to="/rendez-vous" className="hero__cta">
            <span>{t("hero.cta")}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TransitionLink>
        </div>

        {/* Indicateur de défilement */}
        <div className="hero__scroll" ref={scrollRef} aria-hidden="true">
          <span className="hero__scroll-label">{t("hero.scroll")}</span>
          <span className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
}
