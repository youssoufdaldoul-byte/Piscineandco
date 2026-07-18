import { useRef } from "react";
import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import MediaImage from "../../components/MediaImage/MediaImage.jsx";
import Reveal from "../../components/Reveal/Reveal.jsx";
import "./Avis.css";

function Etoiles({ note = 5 }) {
  return (
    <span className="stars" aria-label={`${note}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill={i < note ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 20.5l1.4-6.8L2.2 9l6.9-.7L12 2z" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

export default function Avis() {
  const { t } = useLangue();
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".avis-card");
    const gap = parseFloat(getComputedStyle(track).columnGap || "24");
    const amount = card ? card.offsetWidth + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="section avis" id="avis">
      <div className="container">
        <header className="avis__head">
          <div>
            <Reveal as="p" className="eyebrow">
              {t("avis.eyebrow")}
            </Reveal>
            <Reveal as="h2" className="avis__title" delay={0.05}>
              {t("avis.titre")}
            </Reveal>
            <Reveal as="p" className="avis__intro" delay={0.1}>
              {t("avis.intro")}
            </Reveal>
          </div>

          <Reveal className="avis__rating" delay={0.1} y={20}>
            <strong>{entreprise.stats.note}</strong>
            <Etoiles note={5} />
            <span>
              {entreprise.stats.avis} {t("nav.avis")}
            </span>
          </Reveal>
        </header>
      </div>

      {/* Carrousel */}
      <div className="avis__carousel">
        <div className="avis__track" ref={trackRef}>
          {entreprise.avis.map((a) => (
            <article className="avis-card" key={a.id}>
              <span className="avis-card__quote" aria-hidden="true">&ldquo;</span>
              <Etoiles note={a.note} />
              <p className="avis-card__text">{t(`avis.temoignages.${a.id}`)}</p>
              <div className="avis-card__author">
                <div className="avis-card__thumb">
                  <MediaImage
                    src={a.photo}
                    alt={`${a.auteur} — ${a.lieu}`}
                    label={a.lieu}
                    ratio="carre"
                    showLabel={false}
                    effects={false}
                  />
                </div>
                <div>
                  <span className="avis-card__name">{a.auteur}</span>
                  <span className="avis-card__loc">{a.lieu}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="container avis__controls">
          <button className="avis__btn" onClick={() => scroll(-1)} aria-label="Précédent">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="avis__btn" onClick={() => scroll(1)} aria-label="Suivant">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
