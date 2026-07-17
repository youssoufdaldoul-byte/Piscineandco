import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap.js";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import WaterCanvas from "./WaterCanvas.jsx";
import "./Hero.css";

export default function Hero() {
  const { t } = useLangue();
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const [hasVideo, setHasVideo] = useState(false);

  // Fondu d'entrée + scroll-scrubbing push-in
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const lignes = gsap.utils.toArray(".hero__reveal");

      // Intro : apparition en fondu du titre / sous-titre / CTA
      gsap.set(lignes, { opacity: 0, y: 40 });
      gsap.to(lignes, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.18,
        delay: 0.35,
      });

      if (reduceMotion) return;

      // Push-in cinématique piloté au scroll (technique Apple : pin + scrub)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: stageRef.current,
          pinSpacing: true,
        },
      });

      tl.to(bgRef.current, { scale: 1.28, y: "6%", ease: "none" }, 0)
        .to(contentRef.current, { y: -80, ease: "none" }, 0)
        .to(".hero__content", { opacity: 0, ease: "none" }, 0.55)
        .to(".hero__veil", { opacity: 1, ease: "none" }, 0.4);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={rootRef} id="accueil">
      <div className="hero__stage" ref={stageRef}>
        {/* Fond : surface d'eau 3D (placeholder + effet permanent) */}
        <div className="hero__bg" ref={bgRef}>
          <WaterCanvas />

          {/* Vidéo cinématique par-dessus (visible seulement si le média existe) */}
          <video
            ref={videoRef}
            className={`hero__video ${hasVideo ? "is-visible" : ""}`}
            src={entreprise.medias.heroVideo}
            poster={entreprise.medias.heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setHasVideo(true)}
            aria-hidden="true"
          />

          {/* Voiles de lisibilité + transition */}
          <div className="hero__overlay" />
          <div className="hero__veil" />
        </div>

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

          {/* Indicateur de scroll */}
          <div className="hero__scroll hero__reveal" aria-hidden="true">
            <span className="hero__scroll-label">{t("hero.scroll")}</span>
            <span className="hero__scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
