import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap.js";
import { useLangue } from "../i18n/index.jsx";
import { entreprise } from "../config/entreprise.js";
import PageHero from "../components/PageHero/PageHero.jsx";
import MediaImage from "../components/MediaImage/MediaImage.jsx";
import Reveal from "../components/Reveal/Reveal.jsx";
import TransitionLink from "../router/TransitionLink.jsx";
import Histoire from "../sections/Histoire/Histoire.jsx";
import "./notre-histoire.css";
import "./page.css";

function Chronologie() {
  const { t } = useLangue();
  const rootRef = useRef(null);
  const fillRef = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      if (fillRef.current) fillRef.current.style.transform = "scaleY(1)";
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top 65%", end: "bottom 75%", scrub: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section chrono" ref={rootRef}>
      <div className="container">
        <header className="chrono__head">
          <Reveal as="p" className="eyebrow">{t("histoirePage.chronoEyebrow")}</Reveal>
          <Reveal as="h2" className="chrono__title" delay={0.05}>{t("histoirePage.chronoTitre")}</Reveal>
        </header>

        <div className="chrono__timeline">
          <div className="chrono__line" aria-hidden="true">
            <span className="chrono__line-fill" ref={fillRef} />
          </div>
          <ol className="chrono__items">
            {entreprise.chronologie.map((m, i) => (
              <Reveal as="li" className="chrono__item" key={m.id} delay={(i % 2) * 0.05} y={50}>
                <span className="chrono__dot" aria-hidden="true" />
                <span className="chrono__year">{m.now ? t("histoirePage.maintenant") : m.annee}</span>
                <div className="chrono__card">
                  <div className="chrono__media">
                    <MediaImage src={m.image} alt={t(`histoirePage.chrono.${m.id}.titre`)} ratio="paysage" />
                  </div>
                  <div className="chrono__text">
                    <h3>{t(`histoirePage.chrono.${m.id}.titre`)}</h3>
                    <p>{t(`histoirePage.chrono.${m.id}.texte`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function SavoirFaire() {
  const { t } = useLangue();
  return (
    <section className="section savoir">
      <div className="container">
        <header className="savoir__head">
          <Reveal as="p" className="eyebrow">{t("histoirePage.savoirEyebrow")}</Reveal>
          <Reveal as="h2" className="savoir__title" delay={0.05}>{t("histoirePage.savoirTitre")}</Reveal>
        </header>
        <div className="savoir__grid">
          {entreprise.savoirFaire.map((v, i) => (
            <Reveal as="article" className="savoir__card" key={v.id} delay={i * 0.1} y={44}>
              <div className="savoir__media">
                <MediaImage src={v.image} alt={t(`histoirePage.savoir.${v.id}.titre`)} ratio="paysage" />
              </div>
              <h3>{t(`histoirePage.savoir.${v.id}.titre`)}</h3>
              <p>{t(`histoirePage.savoir.${v.id}.texte`)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaFin() {
  const { t } = useLangue();
  return (
    <section className="section chapitre-cta">
      <div className="container">
        <Reveal as="p" className="eyebrow">{t("histoirePage.ctaEyebrow")}</Reveal>
        <Reveal as="h2" className="chapitre-cta__title" delay={0.05}>{t("histoirePage.ctaTitre")}</Reveal>
        <Reveal as="p" className="chapitre-cta__text" delay={0.1}>{t("histoirePage.ctaTexte")}</Reveal>
        <Reveal className="chapitre-cta__links" delay={0.15}>
          <TransitionLink to="/nos-piscines" className="btn btn--ghost">{t("nav.nosPiscines")}</TransitionLink>
          <TransitionLink to="/rendez-vous" className="btn btn--solid">{t("nav.rendezVous")}</TransitionLink>
        </Reveal>
      </div>
    </section>
  );
}

export default function NotreHistoire() {
  const { t } = useLangue();
  return (
    <article className="page">
      <PageHero
        eyebrow={t("pages.histoire.eyebrow")}
        titre={t("pages.histoire.titre")}
        sousTitre={t("pages.histoire.sousTitre")}
        image="/media/realisations/cap-ferrat.jpg"
        alt={t("pages.histoire.titre")}
      />
      <Chronologie />
      <Histoire />
      <SavoirFaire />
      <CtaFin />
    </article>
  );
}
