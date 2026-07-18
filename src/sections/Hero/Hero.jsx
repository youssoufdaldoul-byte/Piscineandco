import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { gsap } from "../../lib/gsap.js";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import { resolveMedia } from "../../config/mediaRemote.js";
import "./Hero.css";

// Surfaces 3D chargées à part (Three.js hors du bundle initial)
const WaterCanvas = lazy(() => import("./WaterCanvas.jsx"));
const Underwater = lazy(() => import("./Underwater.jsx"));

export default function Hero() {
  const { t } = useLangue();
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const worldRef = useRef(null);
  const aboveRef = useRef(null);
  const glowRef = useRef(null);
  const blurRef = useRef(null);
  const underRef = useRef(null);
  const flashRef = useRef(null);
  const contentRef = useRef(null);
  const resurfaceRef = useRef(null);
  const videoRef = useRef(null);

  const [hasVideo, setHasVideo] = useState(false);
  const [dived, setDived] = useState(false); // monte la scène sous-marine juste avant l'immersion
  const [reduce, setReduce] = useState(false);
  const divedRef = useRef(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(rm);

    const ctx = gsap.context(() => {
      const lignes = gsap.utils.toArray(".hero__reveal");

      // Intro : apparition en fondu du titre / sous-titre / CTA
      gsap.set(lignes, { opacity: 0, y: 40 });
      gsap.to(lignes, {
        opacity: 1, y: 0, duration: 1.4, ease: "power3.out", stagger: 0.18, delay: 0.35,
      });

      if (rm) return; // reduced-motion : pas de séquence scrubbée

      // ─── SÉQUENCE DU PLONGEON : 1 timeline maître, scrubbée, 4 actes ───
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: stageRef.current,
          pinSpacing: true,
          onUpdate: (self) => {
            if (self.progress > 0.35 && !divedRef.current) {
              divedRef.current = true;
              setDived(true);
            }
          },
        },
      });

      // ── ACT 1 — L'APPROCHE (0 → 28%) : la caméra avance lentement ──
      tl.fromTo(worldRef.current, { scale: 1 }, { scale: 1.25, ease: "power1.in", duration: 0.28 }, 0)
        .to(glowRef.current, { opacity: 1, duration: 0.14 }, 0)
        // le titre dérive vers le haut plus lentement que le fond (parallax → profondeur)
        .to(contentRef.current, { yPercent: -18, opacity: 0, ease: "power1.in", duration: 0.24 }, 0.08);

      // ── ACT 2 — L'ACCÉLÉRATION (28 → 52%) : la vitesse monte (ease-in) ──
      tl.to(worldRef.current, { scale: 1.9, ease: "power2.in", duration: 0.24 }, 0.28)
        .to(blurRef.current, { opacity: 0.75, duration: 0.24 }, 0.28)
        .to(glowRef.current, { opacity: 0, duration: 0.16 }, 0.4)
        // léger « bob » de course, piloté au scroll (yoyo court)
        .to(worldRef.current, { yPercent: -1.4, duration: 0.06, yoyo: true, repeat: 3 }, 0.3);

      // ── ACT 3 — LE PLONGEON (52 → 66%) : accélération finale + flash ──
      tl.to(worldRef.current, { scale: 2.8, ease: "power2.in", duration: 0.16 }, 0.52)
        .to(blurRef.current, { opacity: 1, duration: 0.06 }, 0.54)
        // le sous-l'eau arrive SOUS le flash (transition masquée, sans coupure visible)
        .to(underRef.current, { opacity: 1, duration: 0.05 }, 0.56)
        .to(flashRef.current, { opacity: 1, duration: 0.03 }, 0.58)
        .to(flashRef.current, { opacity: 0, duration: 0.06 }, 0.61)
        .to(aboveRef.current, { opacity: 0, duration: 0.04 }, 0.61)
        .to(blurRef.current, { opacity: 0, duration: 0.04 }, 0.63);

      // ── ACT 4 — SOUS L'EAU (60 → 100%) : l'œil s'ajuste, on tient, puis on remonte ──
      tl.fromTo(
        underRef.current,
        { filter: "blur(18px)" },
        { filter: "blur(0px)", ease: "power2.out", duration: 0.18 },
        0.6
      ).to(resurfaceRef.current, { opacity: 0.5, ease: "power1.in", duration: 0.1 }, 0.9);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={`hero ${reduce ? "hero--static" : ""}`} ref={rootRef} id="accueil">
      <div className="hero__stage" ref={stageRef}>
        {/* MONDE (caméra) : au-dessus de l'eau, scale piloté au scroll */}
        <div className="hero__world" ref={worldRef}>
          <div className="hero__above" ref={aboveRef}>
            <Suspense fallback={null}>
              <WaterCanvas />
            </Suspense>
            <video
              ref={videoRef}
              className={`hero__video ${hasVideo ? "is-visible" : ""}`}
              src={resolveMedia(entreprise.medias.heroVideo)}
              poster={resolveMedia(entreprise.medias.heroPoster)}
              autoPlay muted loop playsInline preload="metadata"
              onLoadedData={() => setHasVideo(true)}
              aria-hidden="true"
            />
            <div className="hero__overlay" />
            <div className="hero__glow" ref={glowRef} />
          </div>
        </div>

        {/* Flou de mouvement sur les bords (masque radial) */}
        <div className="hero__blur" ref={blurRef} aria-hidden="true" />

        {/* SOUS L'EAU (monté juste avant l'immersion) */}
        <div className="hero__underwater" ref={underRef} aria-hidden="true">
          {dived && (
            <Suspense fallback={null}>
              <Underwater />
            </Suspense>
          )}
        </div>

        {/* Flash de contact */}
        <div className="hero__flash" ref={flashRef} aria-hidden="true" />

        {/* Halo de résurgence (bloom lumineux vers la section suivante) */}
        <div className="hero__resurface" ref={resurfaceRef} aria-hidden="true" />

        {/* Contenu en surimpression */}
        <div className="hero__content" ref={contentRef}>
          <div className="hero__inner">
            <p className="hero__eyebrow hero__reveal">{entreprise.nom}</p>
            <h1 className="hero__title hero__reveal">{t("hero.titre")}</h1>
            <p className="hero__subtitle hero__reveal">{t("hero.sousTitre")}</p>
            <a href="#devis" className="hero__cta hero__reveal">
              <span>{t("hero.cta")}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className="hero__scroll hero__reveal" aria-hidden="true">
            <span className="hero__scroll-label">{t("hero.scroll")}</span>
            <span className="hero__scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
