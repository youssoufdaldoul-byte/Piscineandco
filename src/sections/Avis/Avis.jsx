import { useLangue } from "../../i18n/index.jsx";
import { entreprise } from "../../config/entreprise.js";
import MediaImage from "../../components/MediaImage/MediaImage.jsx";
import Reveal from "../../components/Reveal/Reveal.jsx";
import "./Avis.css";

function Etoiles({ note = 5 }) {
  return (
    <span className="stars" aria-label={`${note}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="14" height="14" fill={i < note ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 20.5l1.4-6.8L2.2 9l6.9-.7L12 2z" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

function Carte({ a, t }) {
  return (
    <article className="wall-card">
      <Etoiles note={a.note} />
      <p className="wall-card__text">{t(`avis.temoignages.${a.id}`)}</p>
      <div className="wall-card__author">
        {a.photo && (
          <span className="wall-card__thumb">
            <MediaImage src={a.photo} alt={`${a.auteur} — ${a.lieu}`} ratio="carre" showLabel={false} effects={false} />
          </span>
        )}
        <span>
          <span className="wall-card__name">{a.auteur}</span>
          <span className="wall-card__loc">{a.lieu}</span>
        </span>
      </div>
    </article>
  );
}

// Répartit les avis en N colonnes (entrelacés pour varier)
function colonnes(avis, n) {
  const cols = Array.from({ length: n }, () => []);
  avis.forEach((a, i) => cols[i % n].push(a));
  return cols;
}

const CONFIG_COLS = [
  { dir: "up", dur: 40 },
  { dir: "down", dur: 55 },
  { dir: "up", dur: 48 },
];

export default function Avis() {
  const { t } = useLangue();
  const cols = colonnes(entreprise.avis, 3);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section className="section avis" id="avis">
      <div className="container">
        <header className="avis__head">
          <Reveal as="p" className="eyebrow">{t("avis.eyebrow")}</Reveal>
          <Reveal as="h2" className="avis__headline" delay={0.05}>
            <strong>{entreprise.stats.avis}</strong> {t("nav.avis").toLowerCase()}
            <span className="avis__sep">—</span>
            <strong>{entreprise.stats.note}</strong>/5
          </Reveal>
          <Reveal as="p" className="avis__intro" delay={0.1}>{t("avis.intro")}</Reveal>
        </header>
      </div>

      {/* Mur 3 colonnes (marquee vertical infini) */}
      <div className="avis__wall">
        {cols.map((col, ci) => (
          <div
            key={ci}
            className={`wall-col wall-col--${ci === 1 ? "mid" : "side"}`}
          >
            <div
              className={`wall-col__track wall-col__track--${CONFIG_COLS[ci].dir}`}
              style={{ "--dur": `${CONFIG_COLS[ci].dur}s` }}
            >
              {/* jeu dupliqué → boucle sans couture (1 seul jeu si reduced-motion) */}
              {(reduce ? col : [...col, ...col]).map((a, i) => (
                <Carte key={`${a.id}-${i}`} a={a} t={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
