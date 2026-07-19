import { useState } from "react";
import { useLangue } from "../i18n/index.jsx";
import { entreprise } from "../config/entreprise.js";
import { resolveMedia } from "../config/mediaRemote.js";
import PageHero from "../components/PageHero/PageHero.jsx";
import Reveal from "../components/Reveal/Reveal.jsx";
import ProjetOverlay from "../components/ProjetOverlay/ProjetOverlay.jsx";
import "./nos-piscines.css";
import "./page.css";

const LOCALES = { fr: "fr-FR", en: "en-GB", it: "it-IT", ru: "ru-RU" };

function usePrix() {
  const { t, langue } = useLangue();
  const { afficherPrix, devise } = entreprise.piscines;
  return (prixMin) => {
    if (!afficherPrix) return t("piscinesPage.surdevis");
    const n = new Intl.NumberFormat(LOCALES[langue] || "fr-FR").format(prixMin);
    return `${t("piscinesPage.apartir")} ${n} ${devise}`;
  };
}

function Carte({ m, index, onOpen }) {
  const { t } = useLangue();
  const prix = usePrix();
  const num = String(index + 1).padStart(2, "0");
  const nom = t(`piscinesPage.modeles.${m.id}.nom`);

  return (
    <Reveal as="li" className="pcard" delay={(index % 3) * 0.08} y={30}>
      <button className="pcard__btn" onClick={() => onOpen(index)} aria-label={`${t("piscinesPage.voirProjet")} — ${nom}`}>
        <span className="pcard__media">
          <img
            src={resolveMedia(m.image)}
            alt={nom}
            loading={index < 3 ? "eager" : "lazy"}
            draggable="false"
          />
          <span className="pcard__scrim" />
          <span className="pcard__num">{num}</span>
          <span className="pcard__hover">{t("piscinesPage.voirProjet")}</span>
        </span>
        <span className="pcard__info">
          <span className="pcard__nom">{nom}</span>
          <span className="pcard__desc">{t(`piscinesPage.modeles.${m.id}.desc`)}</span>
          <span className="pcard__foot">
            <span className="pcard__prix">{prix(m.prixMin)}</span>
            <span className="pcard__go">
              {t("piscinesPage.voirProjet")}
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </span>
      </button>
    </Reveal>
  );
}

function Comparatif() {
  const { t } = useLangue();
  const prix = usePrix();
  return (
    <section className="section comparatif">
      <div className="container">
        <header className="comparatif__head">
          <Reveal as="p" className="eyebrow">{t("piscinesPage.comparatifEyebrow")}</Reveal>
          <Reveal as="h2" className="comparatif__title" delay={0.05}>{t("piscinesPage.comparatifTitre")}</Reveal>
        </header>

        <div className="comparatif__wrap">
          <table className="comparatif__table">
            <thead>
              <tr>
                <th>{t("piscinesPage.table.modele")}</th>
                <th>{t("piscinesPage.table.budget")}</th>
                <th>{t("piscinesPage.table.delai")}</th>
                <th>{t("piscinesPage.table.entretien")}</th>
              </tr>
            </thead>
            <tbody>
              {entreprise.piscines.modeles.map((m, i) => (
                <Reveal as="tr" key={m.id} delay={i * 0.06} y={20}>
                  <td data-label={t("piscinesPage.table.modele")}>{t(`piscinesPage.modeles.${m.id}.nom`)}</td>
                  <td data-label={t("piscinesPage.table.budget")}>{prix(m.prixMin)}</td>
                  <td data-label={t("piscinesPage.table.delai")}>{m.delai} {t("piscinesPage.specs.delaiUnite")}</td>
                  <td data-label={t("piscinesPage.table.entretien")}>{t(`piscinesPage.entretien.${m.entretien}`)}</td>
                </Reveal>
              ))}
            </tbody>
          </table>
        </div>
        <Reveal as="p" className="comparatif__note" delay={0.1}>{t("piscinesPage.note")}</Reveal>
      </div>
    </section>
  );
}

export default function NosPiscines() {
  const { t } = useLangue();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <article className="page">
      <PageHero
        eyebrow={t("pages.piscines.eyebrow")}
        titre={t("pages.piscines.titre")}
        sousTitre={t("pages.piscines.sousTitre")}
        image="/media/realisations/villa-eze.jpg"
        alt={t("pages.piscines.titre")}
      />

      <section className="section pcatalogue">
        <div className="container">
          <header className="pcatalogue__head">
            <Reveal as="p" className="eyebrow">{t("piscinesPage.comparatifEyebrow")}</Reveal>
            <Reveal as="h2" className="pcatalogue__title" delay={0.05}>{t("pages.piscines.titre")}</Reveal>
          </header>
          <ul className="pcards">
            {entreprise.piscines.modeles.map((m, i) => (
              <Carte key={m.id} m={m} index={i} onOpen={setOpenIndex} />
            ))}
          </ul>
        </div>
      </section>

      <Comparatif />

      <ProjetOverlay index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
    </article>
  );
}
