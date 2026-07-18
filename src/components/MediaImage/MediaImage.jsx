import { useState, useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap.js";
import { resolveMedia } from "../../config/mediaRemote.js";
import "./MediaImage.css";

/**
 * Image cinématique avec placeholder élégant.
 * Effets appliqués à TOUTES les images du site (Phase 3) :
 *  - révélation par masque clip-path (wipe depuis le bas)
 *  - échelle à l'entrée (1.08 → 1.0)
 *  - parallax interne (l'image déborde et glisse à contre-sens du scroll)
 *  - profondeur de champ (flou + désaturation hors du centre, net au centre)
 *  - ken-burns au survol
 *  - color grade unifié (ombres bleutées, hautes lumières chaudes)
 *
 * props :
 *   src, alt, label, sub, ratio, className, eager, showLabel
 *   effects (défaut true) : active reveal/parallax/DOF ; false = image simple
 *     (pour les petites vignettes, ex. avatars d'avis)
 */

function gradientFor(seed = "") {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  const a = 180 + (h % 40);
  const b = 190 + ((h * 3) % 30);
  return `linear-gradient(135deg,
    hsl(${a}, 45%, 16%) 0%,
    hsl(${b}, 55%, 26%) 55%,
    hsl(${b}, 60%, 38%) 100%)`;
}

const RATIOS = { portrait: "3 / 4", paysage: "16 / 10", carre: "1 / 1", large: "16 / 9" };

export default function MediaImage({
  src,
  alt = "",
  label = "",
  sub = "",
  ratio = "paysage",
  className = "",
  eager = false,
  showLabel = true,
  effects = true,
  kenburns = false,
}) {
  const resolvedSrc = resolveMedia(src);
  const [errored, setErrored] = useState(!resolvedSrc);
  const rootRef = useRef(null);
  const parallaxRef = useRef(null);
  const scaleRef = useRef(null);

  useLayoutEffect(() => {
    if (!effects) return;
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 760px)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(root, { clipPath: "inset(0 0 0 0)" });
        gsap.set(scaleRef.current, { scale: 1 });
        root.classList.add("is-focused");
        return;
      }

      // 1) Révélation par masque + échelle à l'entrée
      const tlIn = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 86%", once: true },
      });
      tlIn
        .fromTo(root, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.15, ease: "power3.out" }, 0)
        .fromTo(scaleRef.current, { scale: 1.08 }, { scale: 1, duration: 1.25, ease: "power3.out" }, 0);

      // 2) Parallax interne (transform sur une couche dédiée, GPU)
      gsap.fromTo(
        parallaxRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      // 3) Profondeur de champ : net dans la bande centrale, flou/désaturé ailleurs
      //    (toggle de classe = transition CSS douce, pas de filtre par frame)
      if (mobile) {
        root.classList.add("is-focused"); // pas de DOF sur mobile (perf)
      } else {
        ScrollTrigger.create({
          trigger: root,
          start: "top 78%",
          end: "bottom 22%",
          onToggle: (self) => root.classList.toggle("is-focused", self.isActive),
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [effects]);

  return (
    <div
      className={`media-img ${effects ? "media-img--fx" : ""} ${kenburns ? "media-img--kenburns" : ""} ${className}`}
      style={{ aspectRatio: RATIOS[ratio] || RATIOS.paysage }}
      ref={rootRef}
    >
      <div className="media-img__parallax" ref={parallaxRef}>
        <div className="media-img__scale" ref={scaleRef}>
          {!errored && (
            <img
              src={resolvedSrc}
              alt={alt}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              onError={() => setErrored(true)}
              className="media-img__img"
            />
          )}
          {errored && (
            <div
              className="media-img__placeholder"
              style={{ background: gradientFor(label || alt) }}
              role="img"
              aria-label={alt || label}
            >
              <span className="media-img__shine" aria-hidden="true" />
              <span className="media-img__wave" aria-hidden="true" />
              {showLabel && (label || sub) && (
                <span className="media-img__label">
                  {label}
                  {sub && <em>{sub}</em>}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="media-img__grade" aria-hidden="true" />
    </div>
  );
}
