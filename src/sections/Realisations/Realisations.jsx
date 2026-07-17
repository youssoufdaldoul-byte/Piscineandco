import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import MediaImage from "../../components/MediaImage/MediaImage.jsx";
import Reveal from "../../components/Reveal/Reveal.jsx";
import "./Realisations.css";

export default function Realisations() {
  const { t } = useLangue();

  return (
    <section className="section realisations" id="realisations">
      <div className="container">
        <header className="rea__head">
          <div>
            <Reveal as="p" className="eyebrow">
              {t("realisations.eyebrow")}
            </Reveal>
            <Reveal as="h2" className="rea__title" delay={0.05}>
              {t("realisations.titre")}
            </Reveal>
          </div>
          <Reveal as="p" className="rea__intro" delay={0.1}>
            {t("realisations.intro")}
          </Reveal>
        </header>

        <div className="rea__grid">
          {entreprise.realisations.map((r, i) => (
            <Reveal
              key={r.id}
              className={`rea__item rea__item--${r.ratio}`}
              delay={(i % 3) * 0.08}
              y={50}
            >
              <a className="rea-card" href="#devis" aria-label={`${r.lieu} — ${t(`realisations.categories.${r.categorie}`)}`}>
                <div className="rea-card__media">
                  <MediaImage
                    src={r.src}
                    alt={`${r.lieu} — ${t(`realisations.categories.${r.categorie}`)}`}
                    label={r.lieu}
                    sub={t(`realisations.categories.${r.categorie}`)}
                    ratio={r.ratio === "portrait" ? "portrait" : "paysage"}
                    showLabel={false}
                  />
                  {r.type === "video" && (
                    <span className="rea-card__play" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  )}
                </div>

                <div className="rea-card__overlay">
                  <div className="rea-card__info">
                    <span className="rea-card__cat">
                      {t(`realisations.categories.${r.categorie}`)}
                    </span>
                    <h3 className="rea-card__lieu">{r.lieu}</h3>
                  </div>
                  <span className="rea-card__arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                      <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="rea__footer" delay={0.1}>
          <div className="rea__count">
            <strong>{entreprise.stats.realisations}</strong>
            <span>{t("realisations.eyebrow")}</span>
          </div>
          <a className="rea__cta" href="#devis">
            {t("realisations.voirTout")}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
