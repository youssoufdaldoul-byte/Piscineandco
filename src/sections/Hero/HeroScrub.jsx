import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap.js";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import { resolveMedia } from "../../config/mediaRemote.js";
import TransitionLink from "../../router/TransitionLink.jsx";
import "./HeroScrub.css";

/**
 * HERO SCRUBBÉ AU SCROLL (technique « Apple product page »)
 * ---------------------------------------------------------------------------
 * Une seule vidéo dont la position de lecture est pilotée par le scroll :
 * l'image avance uniquement quand on scrolle, s'arrête quand on s'arrête.
 * - <video> sans autoplay, sans loop, jamais .play().
 * - ScrollTrigger épinglé (scrub) → onUpdate stocke un temps CIBLE.
 * - Une boucle requestAnimationFrame lisse currentTime vers la cible (lerp),
 *   pour éviter le saccadé d'une affectation directe à chaque événement.
 * - On attend `loadedmetadata` (durée fiable) avant de câbler, puis refresh.
 * Le rendu fluide dépend SURTOUT de l'encodage (keyframe sur chaque image).
 */
export default function HeroScrub() {
  const { t } = useLangue();
  const src = entreprise.medias.heroScrub;
  const etapes = t("hero.etapes") || [];
  // La source est choisie ici (l'attribut media sur <source> n'est pas fiable
  // pour <video>) : version mobile allégée sous 760px, sinon desktop.
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;
  const videoSrc = resolveMedia(isMobile ? src.video1280 : src.video1920);

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const introRef = useRef(null);
  const scrollRef = useRef(null);
  const ctaRef = useRef(null);
  const capRefs = useRef([]);

  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 761px)").matches;
    setReduce(rm);

    const video = videoRef.current;
    let raf = 0;
    let ctx;
    let targetTime = 0;

    // Intro + première légende (fondu d'entrée, non lié au scroll)
    gsap.set(introRef.current, { opacity: 0, y: 30 });
    gsap.to(introRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 });
    const caps = capRefs.current.filter(Boolean);
    gsap.fromTo(caps[0], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.5 });

    if (rm) return; // reduced-motion : poster figé, pas de scrub

    // États initiaux posés TOUT DE SUITE : même si la vidéo ne se charge pas,
    // la mise en page reste propre (pas de légendes empilées, CTA masqué).
    gsap.set(caps.slice(1), { opacity: 0, y: 24 });
    gsap.set(ctaRef.current, { opacity: 0, y: 20, pointerEvents: "none" });

    const wire = () => {
      const duration = video?.duration;
      if (!duration || !isFinite(duration)) return;

      // Verrou 1:1 : on place currentTime DIRECTEMENT sur la cible (aucun
      // lissage — Lenis est désormais la seule source d'inertie). On respecte
      // l'état "seeking" pour ne pas saturer le décodeur pendant un scroll rapide.
      const applySeek = () => {
        if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.01) {
          try { video.currentTime = targetTime; } catch (_) { /* seek en cours */ }
        }
        raf = requestAnimationFrame(applySeek);
      };
      raf = requestAnimationFrame(applySeek);

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            // Distance de pin la plus courte possible tout en gardant les
            // légendes lisibles : ~1.3 vh desktop / 0.9 vh mobile → la séquence
            // défile très vite (plancher fixé par la lecture des 5 légendes).
            end: () => "+=" + window.innerHeight * (desktop ? 1.3 : 0.9),
            scrub: true, // verrou dur 1:1 (pas de rattrapage temporisé)
            pin: stageRef.current,
            pinSpacing: true,
            invalidateOnRefresh: true,
            // La position de la vidéo suit la progression du scroll
            onUpdate: (self) => { targetTime = duration * self.progress; },
          },
        });

        // Accroche + indicateur : s'effacent dès l'entrée
        tl.to(introRef.current, { opacity: 0, y: -24, duration: 0.09 }, 0.05)
          .to(scrollRef.current, { opacity: 0, duration: 0.06 }, 0.04);

        // Légendes narratives synchronisées (mêmes bornes que la séquence)
        const windows = [
          [0.0, 0.12], [0.14, 0.30], [0.32, 0.52], [0.54, 0.74], [0.78, 1.0],
        ];
        caps.forEach((cap, i) => {
          if (!cap) return;
          const [inAt, outAt] = windows[i];
          if (i > 0) tl.to(cap, { opacity: 1, y: 0, duration: 0.05 }, inAt);
          if (i < caps.length - 1) tl.to(cap, { opacity: 0, y: -20, duration: 0.05 }, outAt);
        });

        // CTA final
        gsap.set(ctaRef.current, { opacity: 0, y: 20, pointerEvents: "none" });
        tl.to(ctaRef.current, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.06 }, 0.9);
      }, rootRef);

      // Mesures du pin recalculées une fois la vidéo prête
      ScrollTrigger.refresh();
    };

    // On attend la durée fiable (loadedmetadata) avant de câbler
    if (video && video.readyState >= 1 && video.duration) wire();
    else video?.addEventListener("loadedmetadata", wire, { once: true });

    // Refresh une fois tous les médias chargés
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      video?.removeEventListener("loadedmetadata", wire);
      ctx?.revert();
    };
  }, []);

  return (
    <section className={`heros ${reduce ? "heros--static" : ""}`} ref={rootRef} id="accueil">
      <div className="heros__stage" ref={stageRef}>
        <video
          className="heros__video"
          ref={videoRef}
          src={videoSrc}
          poster={resolveMedia(src.poster)}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
        />

        <div className="heros__scrim" aria-hidden="true" />

        {/* Accroche de départ */}
        <div className="heros__intro" ref={introRef}>
          <p className="heros__eyebrow">{entreprise.nom}</p>
          <h1 className="heros__title">{t("hero.titre")}</h1>
        </div>

        {/* Légendes narratives */}
        <div className="heros__captions">
          {etapes.map((e, i) => (
            <figure key={i} className="heros__caption" ref={(el) => (capRefs.current[i] = el)}>
              <figcaption>
                <span className="heros__caption-num">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="heros__caption-titre">{e?.titre}</h2>
                <p className="heros__caption-sous">{e?.sous}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* CTA final */}
        <div className="heros__cta-wrap" ref={ctaRef}>
          <TransitionLink to="/rendez-vous" className="heros__cta">
            <span>{t("hero.cta")}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TransitionLink>
        </div>

        {/* Indicateur de défilement */}
        <div className="heros__scroll" ref={scrollRef} aria-hidden="true">
          <span className="heros__scroll-label">{t("hero.scroll")}</span>
          <span className="heros__scroll-line" />
        </div>
      </div>
    </section>
  );
}
