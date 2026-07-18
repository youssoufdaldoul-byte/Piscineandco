import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import Reveal from "../../components/Reveal/Reveal.jsx";
import TransitionLink from "../../router/TransitionLink.jsx";
import "./Teaser.css";

export default function Teaser() {
  const { t } = useLangue();
  const annees = Math.max(1, new Date().getFullYear() - entreprise.anneeCreation);
  const ligne = t("home.teaser").replace("{x}", annees);

  return (
    <section className="section teaser">
      <div className="container teaser__inner">
        <Reveal className="teaser__rule" y={0}>
          <span />
        </Reveal>
        <Reveal as="p" className="teaser__line" delay={0.05}>
          {ligne}
        </Reveal>
        <Reveal className="teaser__cta" delay={0.12}>
          <TransitionLink to="/notre-histoire" className="teaser__link">
            <span>{t("home.decouvrirHistoire")}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TransitionLink>
        </Reveal>
      </div>
    </section>
  );
}
