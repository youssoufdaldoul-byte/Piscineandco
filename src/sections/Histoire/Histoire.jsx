import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap.js";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import MediaImage from "../../components/MediaImage/MediaImage.jsx";
import Reveal from "../../components/Reveal/Reveal.jsx";
import "./Histoire.css";

export default function Histoire() {
  const { t } = useLangue();
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hist__media [data-parallax]",
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: ".hist__media",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section hist" id="histoire" ref={rootRef}>
      <div className="container hist__grid">
        {/* Colonne image */}
        <div className="hist__media">
          <div data-parallax>
            <MediaImage
              src={entreprise.medias.histoireImage}
              alt={`${entreprise.fondateur} — ${entreprise.nom}`}
              label={entreprise.fondateur}
              sub={t("histoire.signature")}
              ratio="portrait"
            />
          </div>
          <Reveal className="hist__badge" y={20}>
            <strong>{entreprise.stats.experience}</strong>
            <span>{t("histoire.badge")}</span>
          </Reveal>
        </div>

        {/* Colonne texte */}
        <div className="hist__text">
          <Reveal as="p" className="eyebrow">
            {t("histoire.eyebrow")}
          </Reveal>
          <Reveal as="h2" className="hist__title" delay={0.05}>
            {t("histoire.titre")}
          </Reveal>
          <Reveal as="p" className="hist__p" delay={0.1}>
            {t("histoire.p1")}
          </Reveal>
          <Reveal as="p" className="hist__p" delay={0.15}>
            {t("histoire.p2")}
          </Reveal>

          <Reveal className="hist__quote" delay={0.1}>
            <blockquote>{t("histoire.citation")}</blockquote>
            <cite>{t("histoire.signature")}</cite>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
