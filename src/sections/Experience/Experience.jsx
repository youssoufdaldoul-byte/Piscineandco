import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import MediaImage from "../../components/MediaImage/MediaImage.jsx";
import Reveal from "../../components/Reveal/Reveal.jsx";
import "./Experience.css";

export default function Experience() {
  const { t } = useLangue();

  return (
    <section className="section xp" id="experience">
      <div className="container">
        <header className="xp__head">
          <Reveal as="p" className="eyebrow">
            {t("experience.eyebrow")}
          </Reveal>
          <Reveal as="h2" className="xp__title" delay={0.05}>
            {t("experience.titre")}
          </Reveal>
          <Reveal as="p" className="xp__intro" delay={0.1}>
            {t("experience.intro")}
          </Reveal>
        </header>

        <div className="xp__rows">
          {entreprise.services.map((service, i) => (
            <div
              className={`xp-row ${i % 2 === 1 ? "xp-row--reverse" : ""}`}
              key={service.id}
            >
              <div className="xp-row__media">
                <MediaImage
                  src={service.image}
                  alt={t(`experience.services.${service.id}.titre`)}
                  label={t(`experience.services.${service.id}.titre`)}
                  sub={entreprise.nom}
                  ratio={i % 2 === 0 ? "paysage" : "portrait"}
                />
              </div>

              <div className="xp-row__text">
                <Reveal as="span" className="xp-row__num">
                  {String(i + 1).padStart(2, "0")}
                </Reveal>
                <Reveal as="h3" className="xp-row__heading" delay={0.05}>
                  {t(`experience.services.${service.id}.titre`)}
                </Reveal>
                <Reveal as="p" className="xp-row__desc" delay={0.1}>
                  {t(`experience.services.${service.id}.texte`)}
                </Reveal>
                <Reveal className="xp-row__rule" delay={0.15} y={0}>
                  <span />
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
