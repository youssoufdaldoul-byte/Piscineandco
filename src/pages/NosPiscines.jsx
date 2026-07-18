import { useLangue } from "../i18n/index.jsx";
import { entreprise } from "../config/entreprise.js";
import PageHero from "../components/PageHero/PageHero.jsx";
import MediaImage from "../components/MediaImage/MediaImage.jsx";
import MaskReveal from "../components/MaskReveal/MaskReveal.jsx";
import Reveal from "../components/Reveal/Reveal.jsx";
import TransitionLink from "../router/TransitionLink.jsx";
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

function Modele({ m, index }) {
  const { t } = useLangue();
  const prix = usePrix();
  const num = String(index + 1).padStart(2, "0");

  return (
    <section className={`modele ${index % 2 === 1 ? "modele--alt" : ""}`}>
      <div className="modele__media">
        <MediaImage src={m.image} alt={t(`piscinesPage.modeles.${m.id}.nom`)} ratio="large" effects={false} kenburns eager={index === 0} />
      </div>
      <div className="modele__scrim" />
      <div className="container modele__content">
        <span className="modele__num">{num}</span>
        <MaskReveal as="h2" className="modele__nom">
          {t(`piscinesPage.modeles.${m.id}.nom`)}
        </MaskReveal>
        <Reveal as="p" className="modele__desc" delay={0.1}>
          {t(`piscinesPage.modeles.${m.id}.desc`)}
        </Reveal>

        <Reveal className="modele__specs" delay={0.15}>
          <div className="spec">
            <span className="spec__label">{t("piscinesPage.specs.dimensions")}</span>
            <span className="spec__val">{m.dims}</span>
          </div>
          <div className="spec">
            <span className="spec__label">{t("piscinesPage.specs.profondeur")}</span>
            <span className="spec__val">{m.profondeur}</span>
          </div>
          <div className="spec">
            <span className="spec__label">{t("piscinesPage.specs.delai")}</span>
            <span className="spec__val">{m.delai} {t("piscinesPage.specs.delaiUnite")}</span>
          </div>
        </Reveal>

        <Reveal className="modele__foot" delay={0.2}>
          <span className="modele__prix">{prix(m.prixMin)}</span>
          <TransitionLink to={`/rendez-vous?modele=${m.id}`} className="btn btn--solid">
            {t("piscinesPage.demander")}
          </TransitionLink>
        </Reveal>
      </div>
    </section>
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
  return (
    <article className="page">
      <PageHero
        eyebrow={t("pages.piscines.eyebrow")}
        titre={t("pages.piscines.titre")}
        sousTitre={t("pages.piscines.sousTitre")}
        image="/media/realisations/villa-eze.jpg"
        alt={t("pages.piscines.titre")}
      />
      <div className="modeles">
        {entreprise.piscines.modeles.map((m, i) => (
          <Modele key={m.id} m={m} index={i} />
        ))}
      </div>
      <Comparatif />
    </article>
  );
}
